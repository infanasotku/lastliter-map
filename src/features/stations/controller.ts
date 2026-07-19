import type { StationNavigator } from "@/features/stations/ports";
import type { StationService } from "@/features/stations/service";
import type { StationMapItem } from "@/features/stations/types";

export class StationController {
  private readonly service: StationService;
  private readonly navigator: StationNavigator;

  constructor(service: StationService, navigator: StationNavigator) {
    this.service = service;
    this.navigator = navigator;
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
      canOpenStation: this.navigator.canOpenStation(),
    };
  }

  openStation(stationId: string): void {
    this.navigator.openStation(stationId);
  }
}
