import { StationController } from "@/features/stations/controller";
import { stationTest } from "@/test/fixtures/stations";
import { expect, vi } from "vitest";

stationTest(
  "loads stations and selects the first one",
  async ({ station, service, navigator }) => {
    const controller = new StationController(service, navigator);

    const result = await controller.loadMap();

    expect(result.stations[0]?.id).toBe(station.id);
    expect(result.selectedId).toBe(station.id);
    expect(result.canOpenStation).toBe(true);
    expect(navigator.canOpenStation).toHaveBeenCalledOnce();
  },
);

stationTest(
  "keeps selection empty when no stations exist",
  async ({ repository, service, navigator }) => {
    vi.mocked(repository.getAll).mockResolvedValue([]);
    const controller = new StationController(service, navigator);

    await expect(controller.loadMap()).resolves.toMatchObject({
      stations: [],
      selectedId: null,
    });
  },
);

stationTest(
  "delegates station opening to the navigator",
  ({ service, navigator }) => {
    const controller = new StationController(service, navigator);

    controller.openStation("station-42");

    expect(navigator.openStation).toHaveBeenCalledWith("station-42");
  },
);
