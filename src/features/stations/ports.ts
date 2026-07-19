import type { Station } from "../../domain/station";

export interface StationRepository {
  getAll(): Promise<Station[]>;
}

export interface StationHostContext {
  stations: Station[];
  canOpenStation: boolean;
}

export interface StationHost {
  getContext(): Promise<StationHostContext | null>;
  canOpenStation(): boolean;
  openStation(stationId: string): void;
}
