import type { Station } from "@/domain/station";
import type {
  StationNavigator,
  StationRepository,
} from "@/features/stations/ports";
import { StationService } from "@/features/stations/service";
import { test as base, vi } from "vitest";

export function makeStation(overrides: Partial<Station> = {}): Station {
  return {
    id: "station-1",
    name: "Лукойл",
    address: "Большевистская улица, 92",
    latitude: 55.018803,
    longitude: 82.955379,
    score: 0.75,
    confidence: 0.58,
    ...overrides,
  };
}

interface StationFixtures {
  station: Station;
  repository: StationRepository;
  navigator: StationNavigator;
  service: StationService;
}

export const stationTest = base.extend<StationFixtures>({
  station: async ({}, use) => {
    await use(makeStation());
  },
  repository: async ({ station }, use) => {
    await use({ getAll: vi.fn().mockResolvedValue([station]) });
  },
  navigator: async ({}, use) => {
    await use({
      canOpenStation: vi.fn().mockReturnValue(true),
      openStation: vi.fn(),
    });
  },
  service: async ({ repository }, use) => {
    await use(new StationService(repository));
  },
});
