import { StationController } from "@/features/stations/controller";
import { StationService } from "@/features/stations/service";
import { PostMessageStationHost } from "@/infra/host/postMessageStationHost";
import { HostAwareStationRepository } from "@/infra/stations/hostAwareStationRepository";
import { StaticStationRepository } from "@/infra/stations/staticStationRepository";

const stationHost = new PostMessageStationHost();
const stationRepository = new HostAwareStationRepository(
  stationHost,
  new StaticStationRepository(),
);
const stationService = new StationService(stationRepository);

export const stationController = new StationController(
  stationService,
  stationHost,
);
