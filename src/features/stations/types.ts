export interface StationMapItem {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  score: number | null;
  confidence: number | null;
  scoreColor: string;
  confidenceColor: string;
}
