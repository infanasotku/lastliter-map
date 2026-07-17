import type { Station } from "../../domain/station";
import type { StationRepository } from "../../features/stations/ports";

// recent_comments.md contains observations for station 474954443, but no
// coordinates. Its last visible OSM coordinates are used below. The second
// station comes from nearby.md because recent_comments.md contains only one ID.
const stations: Station[] = [
  {
    id: "474954443",
    name: "Лукойл",
    address: "Большевистская улица",
    latitude: 54.9916557,
    longitude: 82.9792085,
    status: "queue",
    detail: "92, ДТ · ≈ 5–20 машин",
    confirmations: 12,
    confidence: 0.58,
    observedAt: "2026-07-04T05:11:15+07:00",
  },
  {
    id: "410849648",
    name: "Газпромнефть",
    address: "ул. Декабристов, 271",
    latitude: 54.9989062,
    longitude: 82.9777103,
    status: "low",
    detail: "92 · Бензин заканчивается",
    confirmations: 23,
    confidence: 0.7375,
    observedAt: "2026-07-04T04:21:54+07:00",
  },
];

export class StaticStationRepository implements StationRepository {
  async getAll(): Promise<Station[]> {
    return stations.map((station) => ({ ...station }));
  }
}
