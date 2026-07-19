import type { StationStatus } from "../../domain/station";
import type { StationRepository } from "./ports";
import type { StationMapItem } from "./types";

const statusLabels: Record<StationStatus, string> = {
  yes: "Топливо есть",
  queue: "Есть очередь",
  low: "Топливо заканчивается",
  no: "Топлива нет",
  unknown: "Нет наблюдений",
};

export class StationService {
  private readonly repository: StationRepository;

  constructor(repository: StationRepository) {
    this.repository = repository;
  }

  async getMapItems(): Promise<StationMapItem[]> {
    const stations = await this.repository.getAll();

    return stations.map((station) => {
      const status = station.status ?? "unknown";

      return {
        id: station.id,
        name: station.name,
        address: station.address,
        position: [station.latitude, station.longitude],
        status,
        statusLabel: statusLabels[status],
        detail: station.detail || "Наблюдений пока нет",
        confirmationsLabel:
          station.confirmations === undefined
            ? "Нет данных"
            : `${station.confirmations} подтверждений`,
        confidenceLabel:
          station.confidence === undefined
            ? "Нет данных"
            : `${Math.round(station.confidence * 100)}% уверенности`,
        observedAtLabel: station.observedAt
          ? new Intl.DateTimeFormat("ru-RU", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(station.observedAt))
          : "Нет данных",
      };
    });
  }
}
