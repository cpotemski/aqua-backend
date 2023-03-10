import {TickElement} from "../tick-element.model";
import {PrismaClient} from "@prisma/client";
import {BuildOrderType} from "../../resolvers-types";

export const BuildOrderProgress: TickElement = {
    name: 'buildOrderProgress',
    async tick(prisma: PrismaClient) {
        await prisma.buildOrder.updateMany({
            data: {remainingTime: {decrement: 1}}
        });

        const finishedShipBuildOrders = await prisma.buildOrder.findMany({
            where: {
                remainingTime: 0,
                type: BuildOrderType.Ship
            }
        });

        await Promise.all(finishedShipBuildOrders.map(async order => {
            const player = await prisma.player.findFirst({where: {id: order.ownerId}, include: {fleets: true}});
            const baseFleet = player.fleets.find(fleet => fleet.baseFleet === true);
            await prisma.fleet.update({
                where: {id: baseFleet.id},
                data: {ships: {update: {[order.what]: {increment: order.amount}}}}
            });
        }))

        const finishedHarvesterBuildOrders = await prisma.buildOrder.findMany({
            where: {
                remainingTime: 0,
                type: BuildOrderType.Harvester
            }
        });

        await Promise.all(finishedHarvesterBuildOrders.map(async order => {
            await prisma.station.update({
                where: {ownerId: order.ownerId},
                data: {harvesters: {increment: order.amount}}
            });
        }));

        await prisma.buildOrder.deleteMany({where: {remainingTime: 0}});
    }
}