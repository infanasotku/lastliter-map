import type { StationHost } from "./ports";
import type { StationService } from "./service";
import type { StationMapItem } from "./types";

export class StationController {
  private readonly service: StationService;
  private readonly host: StationHost;

  constructor(service: StationService, host: StationHost) {
    this.service = service;
    this.host = host;
  }

  async loadMap(): Promise<{
    stations: StationMapItem[];
    selectedId: string | null;
    canOpenStation: boolean;
  }> {
    const stations = await this.service.getMapItems();

    return {
      stations,
      selectedId: stations[0]?.id ?? null,
      canOpenStation: this.host.canOpenStation(),
    };
  }

  openStation(stationId: string): void {
    this.host.openStation(stationId);
  }
}
