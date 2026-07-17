import type { StationStatus } from "../../domain/station";
import type { StationRepository } from "./ports";
import type { StationMapItem } from "./types";

const statusLabels: Record<StationStatus, string> = {
  yes: "Топливо есть",
  queue: "Есть очередь",
  low: "Топливо заканчивается",
  no: "Топлива нет",
};

export class StationService {
  private readonly repository: StationRepository;

  constructor(repository: StationRepository) {
    this.repository = repository;
  }

  async getMapItems(): Promise<StationMapItem[]> {
    const stations = await this.repository.getAll();

    return stations.map((station) => ({
      id: station.id,
      name: station.name,
      address: station.address,
      position: [station.latitude, station.longitude],
      status: station.status,
      statusLabel: statusLabels[station.status],
      detail: station.detail || "Без дополнительного комментария",
      confirmationsLabel: `${station.confirmations} подтверждений`,
      confidenceLabel: `${Math.round(station.confidence * 100)}% уверенности`,
      observedAtLabel: new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(station.observedAt)),
    }));
  }
}
