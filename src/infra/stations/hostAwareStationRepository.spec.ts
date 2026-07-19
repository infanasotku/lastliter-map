import type { StationContextProvider } from "@/features/stations/ports";
import { HostAwareStationRepository } from "@/infra/stations/hostAwareStationRepository";
import { makeStation, stationTest } from "@/test/fixtures/stations";
import { expect, vi } from "vitest";

stationTest("uses stations supplied by the host", async ({ repository }) => {
  const hostStation = makeStation({ id: "admin-station" });
  const contextProvider: StationContextProvider = {
    getContext: vi.fn().mockResolvedValue({
      stations: [hostStation],
      canOpenStation: true,
    }),
    hasHost: vi.fn().mockReturnValue(true),
  };
  const hostAwareRepository = new HostAwareStationRepository(
    contextProvider,
    repository,
  );

  await expect(hostAwareRepository.getAll()).resolves.toEqual([hostStation]);
  expect(repository.getAll).not.toHaveBeenCalled();
});

stationTest(
  "does not use demo data when the host failed to answer",
  async ({ repository }) => {
    const contextProvider: StationContextProvider = {
      getContext: vi.fn().mockResolvedValue(null),
      hasHost: vi.fn().mockReturnValue(true),
    };
    const hostAwareRepository = new HostAwareStationRepository(
      contextProvider,
      repository,
    );

    await expect(hostAwareRepository.getAll()).resolves.toEqual([]);
    expect(repository.getAll).not.toHaveBeenCalled();
  },
);

stationTest(
  "uses demo data in standalone mode",
  async ({ station, repository }) => {
    const contextProvider: StationContextProvider = {
      getContext: vi.fn().mockResolvedValue(null),
      hasHost: vi.fn().mockReturnValue(false),
    };
    const hostAwareRepository = new HostAwareStationRepository(
      contextProvider,
      repository,
    );

    await expect(hostAwareRepository.getAll()).resolves.toEqual([station]);
    expect(repository.getAll).toHaveBeenCalledOnce();
  },
);
