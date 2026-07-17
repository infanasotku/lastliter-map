import type { StationStatus } from "../../domain/station";

export interface StationMapItem {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  status: StationStatus;
  statusLabel: string;
  detail: string;
  confirmationsLabel: string;
  confidenceLabel: string;
  observedAtLabel: string;
}
