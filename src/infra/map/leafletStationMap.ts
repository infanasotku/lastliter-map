import L, { type Map as LeafletMap, type Marker } from "leaflet";
import { getYandexTilesApiKey } from "@/config/runtime";
import type { StationMapItem } from "@/features/stations/types";

export interface StationMapHandle {
  destroy(): void;
  select(stationId: string): void;
}

interface CreateStationMapOptions {
  element: HTMLElement;
  stations: StationMapItem[];
  selectedId: string | null;
  onSelect(stationId: string): void;
}

function createMarker(station: StationMapItem): Marker {
  const icon = L.divIcon({
    className: "station-marker-shell",
    html: `<span class="station-marker" style="--marker-color: ${station.scoreColor}; --marker-border-color: ${station.confidenceColor}" aria-hidden="true"><span></span></span>`,
    iconSize: [42, 48],
    iconAnchor: [21, 44],
    tooltipAnchor: [0, -40],
  });

  return L.marker(station.position, { icon, title: station.name }).bindTooltip(
    station.name,
    { direction: "top", offset: [0, -8] },
  );
}

function fitStations(map: LeafletMap, stations: StationMapItem[]): void {
  if (stations.length === 0) {
    map.setView([55.03, 82.92], 11);
    return;
  }

  map.fitBounds(L.latLngBounds(stations.map((station) => station.position)), {
    padding: [72, 72],
    maxZoom: 14,
  });
}

export function createLeafletStationMap({
  element,
  stations,
  selectedId,
  onSelect,
}: CreateStationMapOptions): StationMapHandle {
  const map = L.map(element, {
    attributionControl: false,
    zoomControl: false,
  });
  const markers = new Map<string, Marker>();

  const apiKey = getYandexTilesApiKey();
  const tileUrl = `https://tiles.api-maps.yandex.ru/v1/tiles/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU&l=map&projection=web_mercator&x={x}&y={y}&z={z}`;

  L.tileLayer(tileUrl, {
    minZoom: 0,
    maxZoom: 20,
    tileSize: 256,
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);

  function markSelected(stationId: string): void {
    for (const [markerStationId, marker] of markers) {
      const isSelected = markerStationId === stationId;
      marker.getElement()?.classList.toggle("is-selected", isSelected);
      marker.setZIndexOffset(isSelected ? 1000 : 0);
    }
  }

  for (const station of stations) {
    const marker = createMarker(station).addTo(map);
    marker.on("click", () => {
      markSelected(station.id);
      onSelect(station.id);
    });
    markers.set(station.id, marker);
  }

  fitStations(map, stations);
  if (selectedId) markSelected(selectedId);

  return {
    destroy: () => map.remove(),
    select: (stationId) => {
      const marker = markers.get(stationId);
      if (!marker) return;

      markSelected(stationId);
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), {
        duration: 0.6,
      });
      marker.openTooltip();
    },
  };
}
