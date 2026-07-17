import type { Station } from "../../domain/station";

export interface StationRepository {
  getAll(): Promise<Station[]>;
}
