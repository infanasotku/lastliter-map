<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import "vue-sonner/style.css";
import { Toaster } from "vue-sonner";
import { stationController } from "@/container";
import StationDetails from "@/components/StationDetails.vue";
import type { StationMapItem } from "@/features/stations/types";
import {
  createLeafletStationMap,
  type StationMapHandle,
} from "@/infra/map/leafletStationMap";

const mapElement = ref<HTMLElement | null>(null);
const stations = ref<StationMapItem[]>([]);
const selectedId = ref<string | null>(null);
const canOpenStation = ref(false);
const error = ref<string | null>(null);
let mapHandle: StationMapHandle | null = null;

const selectedStation = computed(
  () =>
    stations.value.find((station) => station.id === selectedId.value) ?? null,
);

function selectStation(stationId: string, moveMap = true): void {
  selectedId.value = stationId;
  if (moveMap) mapHandle?.select(stationId);
}

onMounted(async () => {
  try {
    const model = await stationController.loadMap();
    stations.value = model.stations;
    selectedId.value = model.selectedId;
    canOpenStation.value = model.canOpenStation;
    await nextTick();

    if (!mapElement.value) return;
    mapHandle = createLeafletStationMap({
      element: mapElement.value,
      stations: stations.value,
      selectedId: selectedId.value,
      onSelect: (stationId) => selectStation(stationId, false),
    });
  } catch (cause) {
    error.value =
      cause instanceof Error ? cause.message : "Не удалось открыть карту";
  }
});

onBeforeUnmount(() => mapHandle?.destroy());
</script>

<template>
  <Toaster position="top-right" rich-colors />

  <div ref="mapElement" class="app-map" aria-label="Карта станций" />

  <a
    class="yandex-logo"
    href="https://yandex.ru/maps"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Открыть Яндекс Карты"
  >
    <img src="/yandex/logo.svg" alt="Яндекс" />
  </a>

  <div v-if="error" class="map-error" role="alert">{{ error }}</div>

  <aside class="station-panel">
    <StationDetails
      v-if="selectedStation"
      :station="selectedStation"
      :can-open="canOpenStation"
      @open="stationController.openStation(selectedStation.id)"
    />
  </aside>
</template>
