export type StationStatus = "yes" | "queue" | "low" | "no";

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  detail: string;
  confirmations: number;
  confidence: number;
  observedAt: string;
}
