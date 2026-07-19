import type { Station } from "@/domain/station";

export interface StationRepository {
  getAll(): Promise<Station[]>;
}

export interface StationHostContext {
  stations: Station[];
  canOpenStation: boolean;
}

export interface StationContextProvider {
  getContext(): Promise<StationHostContext | null>;
  hasHost(): boolean;
}

export interface StationNavigator {
  canOpenStation(): boolean;
  openStation(stationId: string): void;
}
