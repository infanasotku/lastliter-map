import type { Station } from "@/domain/station";
import type { StationRepository } from "@/features/stations/ports";

const stations: Station[] = [
  {
    id: "474954443",
    name: "Лукойл",
    address: "Большевистская улица",
    latitude: 54.9916557,
    longitude: 82.9792085,
    score: 0.35,
    confidence: 0.58,
  },
  {
    id: "410849648",
    name: "Газпромнефть",
    address: "ул. Декабристов, 271",
    latitude: 54.9989062,
    longitude: 82.9777103,
    score: 0.68,
    confidence: 0.7375,
  },
];

export class StaticStationRepository implements StationRepository {
  async getAll(): Promise<Station[]> {
    return stations.map((station) => ({ ...station }));
  }
}
