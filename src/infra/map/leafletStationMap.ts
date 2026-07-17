import L, { type Map as LeafletMap, type Marker } from "leaflet";
import { getYandexTilesApiKey } from "@/config/runtime";
import type { StationStatus } from "../../domain/station";
import type { StationMapItem } from "../../features/stations/types";

const statusColors: Record<StationStatus, string> = {
  yes: "#2f855a",
  queue: "#db7c0a",
  low: "#c2410c",
  no: "#b42318",
};

export interface StationMapHandle {
  destroy(): void;
  select(stationId: string): void;
}

interface CreateStationMapOptions {
  element: HTMLElement;
  stations: StationMapItem[];
  onSelect(stationId: string): void;
}

function createMarker(station: StationMapItem): Marker {
  const color = statusColors[station.status];
  const icon = L.divIcon({
    className: "station-marker-shell",
    html: `<span class="station-marker" style="--marker-color: ${color}" aria-hidden="true"><span></span></span>`,
    iconSize: [42, 48],
    iconAnchor: [21, 44],
    tooltipAnchor: [0, -40],
  });

  return L.marker(station.position, { icon, title: station.name }).bindTooltip(
    `${station.name} · ${station.statusLabel}`,
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

  for (const station of stations) {
    const marker = createMarker(station).addTo(map);
    marker.on("click", () => onSelect(station.id));
    markers.set(station.id, marker);
  }

  fitStations(map, stations);

  return {
    destroy: () => map.remove(),
    select: (stationId) => {
      const marker = markers.get(stationId);
      if (!marker) return;

      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), {
        duration: 0.6,
      });
      marker.openTooltip();
    },
  };
}
