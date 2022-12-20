import {AquaContext} from "../aqua-context.model";
import {Resolvers, Resources} from "../resolvers-types";
import {SHIP_DATA} from "../ship/ship-data";
import {generatePrismaOperationForCosts} from "../prisma/database.helper";
import {HARVESTER_COSTS} from "../config";

export const buildResolvers: Resolvers<AquaContext> = {
    Query: {
        buildOrders: async (_, _1, {prisma, player}) => {
            return prisma.buildOrder.findMany({where: {ownerId: player.id}});
        }
    },
    Mutation: {
        createBuildOrder: async (_, {input}, {prisma, player}) => {
            const shipName = input.type === 'Ship' ? input.what : null;
            const ship = SHIP_DATA.find(ship => ship.name === shipName);

            //TODO: Calculate harvester costs
            const costs: Resources = ship.costs || HARVESTER_COSTS;

            return prisma.$transaction(async tx => {
                const updatedResources = await tx.resources.update({
                    where: {id: player.station.resources.id},
                    data: generatePrismaOperationForCosts(costs)
                });

                if (updatedResources.aluminium < 0 || updatedResources.steel < 0 || updatedResources.plutonium < 0) {
                    throw new Error('not enough resources');
                }

                return tx.buildOrder.create({
                    data: {
                        ...input,
                        what: shipName,
                        owner: {connect: {id: player.id}},
                        remainingTime: ship.buildTime || 4
                    }
                });
            });
        }
    }
};