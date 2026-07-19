import { StationController } from "@/features/stations/controller";
import type {
  StationContextProvider,
  StationNavigator,
} from "@/features/stations/ports";
import { StationService } from "@/features/stations/service";
import { PostMessageStationHost } from "@/infra/host/postMessageStationHost";
import { SonnerNotificationService } from "@/infra/notifications/sonnerNotificationService";
import { HostAwareStationRepository } from "@/infra/stations/hostAwareStationRepository";
import { StaticStationRepository } from "@/infra/stations/staticStationRepository";

const stationBridge = new PostMessageStationHost(
  new SonnerNotificationService(),
);
const stationContextProvider: StationContextProvider = stationBridge;
const stationNavigator: StationNavigator = stationBridge;
const stationRepository = new HostAwareStationRepository(
  stationContextProvider,
  new StaticStationRepository(),
);
const stationService = new StationService(stationRepository);

export const stationController = new StationController(
  stationService,
  stationNavigator,
);
