import {TickElement} from "../tick-element.model";
import {PrismaClient} from "@prisma/client";
import {generatePrismaOperationForCosts} from "../../prisma/database.helper";

export const FleetMovement: TickElement = {
    name: 'buildOrderProgress',
    async tick(prisma: PrismaClient) {
        // move all fleets
        await prisma.fleet.updateMany({where: {remainingTime: {gt: 0}}, data: {remainingTime: {decrement: 1}}});

        // get returning fleets that arrive this tick
        const homecomingFleets = await prisma.fleet.findMany({
            where: {remainingTime: 0, returning: true},
            include: {resources: true}
        });

        // unload resources from fleet to station
        await Promise.all(homecomingFleets.map(async (fleet) => {
            await prisma.station.update({
                where: {ownerId: fleet.ownerId},
                data: {resources: {update: generatePrismaOperationForCosts(fleet.resources, 'increment')}}
            })
        }))

        // reset fleets
        await prisma.fleet.updateMany({
            where: {id: {in: homecomingFleets.map(f => f.id)}},
            data: {
                targetId: null,
                travelTime: null,
                remainingTime: null,
                actionTicks: null,
                returning: null
            }
        })

        // reset resources from fleets
        await prisma.resources.updateMany({
            where: {id: {in: homecomingFleets.map(f => f.resourcesId)}},
            data: {
                aluminium: 0,
                steel: 0,
                plutonium: 0
            }
        })
    }
}