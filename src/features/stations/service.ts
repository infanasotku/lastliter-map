import type { StationRepository } from "@/features/stations/ports";
import {
  getConfidenceColor,
  getScoreColor,
} from "@/features/stations/stationColors";
import type { StationMapItem } from "@/features/stations/types";

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
      score: station.score,
      confidence: station.confidence,
      scoreColor: getScoreColor(station.score),
      confidenceColor: getConfidenceColor(station.confidence),
    }));
  }
}
