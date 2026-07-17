import type { StationService } from "./service";
import type { StationMapItem } from "./types";

export class StationController {
  private readonly service: StationService;

  constructor(service: StationService) {
    this.service = service;
  }

  async loadMap(): Promise<{
    stations: StationMapItem[];
    selectedId: string | null;
  }> {
    const stations = await this.service.getMapItems();

    return {
      stations,
      selectedId: stations[0]?.id ?? null,
    };
  }
}
