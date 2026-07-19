<script setup lang="ts">
import type { StationMapItem } from "@/features/stations/types";

defineProps<{
  station: StationMapItem;
  canOpen: boolean;
}>();

defineEmits<{
  open: [];
}>();
</script>

<template>
  <article class="station-card">
    <header>
      <div>
        <p class="eyebrow">Станция {{ station.id }}</p>
        <h2>{{ station.name }}</h2>
      </div>
    </header>

    <p class="address">{{ station.address }}</p>

    <dl v-if="station.score !== null || station.confidence !== null">
      <div>
        <dt>Score</dt>
        <dd>{{ station.score?.toFixed(2) ?? "Нет данных" }}</dd>
      </div>
      <div>
        <dt>Confidence</dt>
        <dd>{{ station.confidence?.toFixed(2) ?? "Нет данных" }}</dd>
      </div>
    </dl>

    <button
      v-if="canOpen"
      class="open-button"
      type="button"
      @click="$emit('open')"
    >
      Открыть
    </button>
  </article>
</template>

<style scoped>
.station-card {
  padding: 22px;
  border: 1px solid rgba(31, 52, 36, 0.12);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.93);
  box-shadow: 0 14px 42px rgba(25, 43, 30, 0.16);
  backdrop-filter: blur(18px);
}

header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 14px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #69806f;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.035em;
}

.address {
  margin: 8px 0 0;
  color: #657068;
  font-size: 13px;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 18px 0 0;
  gap: 14px;
}

dt {
  margin-bottom: 3px;
  color: #7b857e;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

dd {
  margin: 0;
  color: #23342a;
  font-size: 13px;
  font-weight: 650;
}

.open-button {
  width: 100%;
  margin-top: 18px;
  padding: 11px 16px;
  border: 0;
  border-radius: 12px;
  color: white;
  background: #203b28;
  font-weight: 700;
}

.open-button:hover {
  background: #162b1d;
}
</style>
