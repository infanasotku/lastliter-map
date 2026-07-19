import type { StationHost } from "@/features/stations/ports";
import type { StationService } from "@/features/stations/service";
import type { StationMapItem } from "@/features/stations/types";

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
    hostError: string | null;
  }> {
    const stations = await this.service.getMapItems();

    return {
      stations,
      selectedId: stations[0]?.id ?? null,
      canOpenStation: this.host.canOpenStation(),
      hostError: this.host.getError(),
    };
  }

  openStation(stationId: string): void {
    this.host.openStation(stationId);
  }
}
