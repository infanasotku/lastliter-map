export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  score: number | null;
  confidence: number | null;
}
