import type { Station } from "@/domain/station";
import type {
  StationContextProvider,
  StationRepository,
} from "@/features/stations/ports";

export class HostAwareStationRepository implements StationRepository {
  private readonly contextProvider: StationContextProvider;
  private readonly fallback: StationRepository;

  constructor(
    contextProvider: StationContextProvider,
    fallback: StationRepository,
  ) {
    this.contextProvider = contextProvider;
    this.fallback = fallback;
  }

  async getAll(): Promise<Station[]> {
    const context = await this.contextProvider.getContext();
    return context ? context.stations : this.fallback.getAll();
  }
}
