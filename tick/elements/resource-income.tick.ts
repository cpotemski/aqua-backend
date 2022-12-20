import {TickElement} from "../tick-element.model";
import {PrismaClient} from "@prisma/client";
import {findNearestResourceNodes} from "../../resource";
import {ResourceType} from "../../resolvers-types";
import {HARVESTER_CAPACITY, HARVESTER_MINING_SPEED, HARVESTER_TRAVEL_SPEED, HARVESTER_UNLOAD_SPEED} from "../../config";

export const ResourceIncome: TickElement = {
    name: 'resourceIncome',
    async tick(prisma: PrismaClient) {
        const stations = await prisma.station.findMany({include: {coordinates: true, resources: true}});
        const resourceNodes = await prisma.resourceNode.findMany({include: {coordinates: true}});

        await Promise.all(stations.map(station => {
            const aluminiumHarvesters = Math.floor(station.harvesters * station.distribution[0] / 100);
            const steelHarvesters = Math.floor(station.harvesters * station.distribution[1] / 100);
            const plutoniumHarvesters = station.harvesters - aluminiumHarvesters - steelHarvesters;

            const nodes = findNearestResourceNodes(resourceNodes, station.coordinates);

            const aluminiumIncome = aluminiumHarvesters * calculateHarvesterIncomePerTick(nodes[ResourceType.Aluminium].distance);
            const steelIncome = steelHarvesters * calculateHarvesterIncomePerTick(nodes[ResourceType.Steel].distance);
            const plutoniumIncome = plutoniumHarvesters * calculateHarvesterIncomePerTick(nodes[ResourceType.Plutonium].distance);

            return prisma.station.update({
                where: {id: station.id},
                data: {
                    resources: {
                        update: {
                            aluminium: {increment: aluminiumIncome},
                            steel: {increment: steelIncome},
                            plutonium: {increment: plutoniumIncome}
                        }
                    }
                }
            })
        }))
    }
}

const calculateHarvesterIncomePerTick = (distance: number) => {
    const timeForMining = HARVESTER_CAPACITY / HARVESTER_MINING_SPEED;
    const timeForTravel = distance * 2 / HARVESTER_TRAVEL_SPEED;
    const timeForUnload = HARVESTER_CAPACITY / HARVESTER_UNLOAD_SPEED;
    const tripTime = timeForTravel + timeForMining + timeForUnload;

    return Math.floor(HARVESTER_CAPACITY / tripTime);
}