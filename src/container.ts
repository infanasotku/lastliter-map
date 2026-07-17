import { StationController } from "@/features/stations/controller";
import { StationService } from "@/features/stations/service";
import { StaticStationRepository } from "@/infra/stations/staticStationRepository";

const stationRepository = new StaticStationRepository();
const stationService = new StationService(stationRepository);

export const stationController = new StationController(stationService);
