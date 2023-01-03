import {Fleet} from "@prisma/client";

export const isFleetBusy = (fleet: Fleet): boolean => {
    return Boolean(fleet.remainingTime) || Boolean(fleet.actionTicks);
}