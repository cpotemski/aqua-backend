import {Resources} from "../resolvers-types";

// general
export const TICK_ACTIVE = false;
export const TICK_INTERVAL = 30;
export const LOGGING_ACTIVE = true;

// harvesters
export const HARVESTER_TRAVEL_SPEED = 10; // units per tick
export const HARVESTER_MINING_SPEED = 2000; // resources per tick
export const HARVESTER_CAPACITY = 1000;
export const HARVESTER_UNLOAD_SPEED = 5000;
export const HARVESTER_COSTS: Resources = {aluminium: 1000, steel: 1000};

// fleets and ships
export const MAX_FLEETS_PER_PLAYER = 3;
