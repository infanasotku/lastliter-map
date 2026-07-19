import {
  getConfidenceColor,
  getScoreColor,
} from "@/features/stations/stationColors";
import { stationTest } from "@/test/fixtures/stations";
import { expect, vi } from "vitest";

stationTest(
  "converts repository stations into map items",
  async ({ station, repository, service }) => {
    await expect(service.getMapItems()).resolves.toEqual([
      {
        id: station.id,
        name: station.name,
        address: station.address,
        position: [station.latitude, station.longitude],
        score: station.score,
        confidence: station.confidence,
        scoreColor: getScoreColor(station.score),
        confidenceColor: getConfidenceColor(station.confidence),
      },
    ]);
    expect(repository.getAll).toHaveBeenCalledOnce();
  },
);

stationTest(
  "returns an empty map for an empty repository",
  async ({ repository, service }) => {
    vi.mocked(repository.getAll).mockResolvedValue([]);

    await expect(service.getMapItems()).resolves.toEqual([]);
  },
);
