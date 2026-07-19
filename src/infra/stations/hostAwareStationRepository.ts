import type { Station } from "@/domain/station";
import type { StationHost, StationRepository } from "@/features/stations/ports";

export class HostAwareStationRepository implements StationRepository {
  private readonly host: StationHost;
  private readonly fallback: StationRepository;

  constructor(host: StationHost, fallback: StationRepository) {
    this.host = host;
    this.fallback = fallback;
  }

  async getAll(): Promise<Station[]> {
    const context = await this.host.getContext();
    return context ? context.stations : this.fallback.getAll();
  }
}
