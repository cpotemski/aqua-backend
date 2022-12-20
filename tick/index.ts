// interval in seconds
import {PrismaClient} from "@prisma/client";
import {ResourceIncome} from "./elements/resource-income.tick";
import {BuildOrderProgress} from "./elements/build-order-progress.tick";
import {FleetMovement} from "./elements/fleet-movement.tick";
import {LOGGING_ACTIVE, TICK_INTERVAL} from "../config";

const elements = [
    ResourceIncome,
    BuildOrderProgress,
    FleetMovement
];

export const startTick = (prisma: PrismaClient) => {
    setTimeout(async () => {
        await executeTick(prisma);
    }, getTickOffset());
}

const getTickOffset = () => {
    return (TICK_INTERVAL * 1000) - ((new Date()).getTime() % (TICK_INTERVAL * 1000));
}

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const executeTick = async (prisma: PrismaClient) => {
    if (LOGGING_ACTIVE) {
        const timestamp = (new Date()).toLocaleTimeString();
        console.log(`[Tick] - ${timestamp}`);
        console.log(`---------------------`);
        console.time('Duration');
    }
    for (const element of elements) {
        if (LOGGING_ACTIVE) console.time(`[${element.name}]`);
        await element.tick(prisma);
        if (LOGGING_ACTIVE) console.timeEnd(`[${element.name}]`);
    }
    if (LOGGING_ACTIVE) {
        console.log(`---------------------`);
        console.timeEnd('Duration');
    }
    await timeout(getTickOffset());
    await executeTick(prisma);
}