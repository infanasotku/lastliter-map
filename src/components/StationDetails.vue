<script setup lang="ts">
import type { StationMapItem } from "../features/stations/types";

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
      <span class="status" :data-status="station.status">
        {{ station.statusLabel }}
      </span>
    </header>

    <p class="address">{{ station.address }}</p>
    <p class="detail">{{ station.detail }}</p>

    <dl>
      <div>
        <dt>Доверие</dt>
        <dd>{{ station.confidenceLabel }}</dd>
      </div>
      <div>
        <dt>Сигналы</dt>
        <dd>{{ station.confirmationsLabel }}</dd>
      </div>
      <div>
        <dt>Наблюдение</dt>
        <dd>{{ station.observedAtLabel }}</dd>
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

.status {
  padding: 6px 9px;
  flex: 0 0 auto;
  border-radius: 999px;
  color: #7a2e0e;
  background: #ffead5;
  font-size: 11px;
  font-weight: 750;
}

.status[data-status="yes"] {
  color: #17633a;
  background: #dcf4e6;
}

.status[data-status="no"] {
  color: #891f1f;
  background: #ffe2e0;
}

.status[data-status="unknown"] {
  color: #475467;
  background: #eaecf0;
}

.address {
  margin: 8px 0 18px;
  color: #657068;
  font-size: 13px;
}

.detail {
  margin: 0;
  padding: 14px 16px;
  border-radius: 14px;
  color: #23392a;
  background: #edf3ec;
  font-weight: 650;
  line-height: 1.45;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 18px 0 0;
  gap: 14px;
}

dl div:last-child {
  grid-column: 1 / -1;
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
