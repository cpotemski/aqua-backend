import {AquaContext} from "../aqua-context.model";
import {BuildOrderType, Resolvers, ShipName} from "../resolvers-types";
import {SHIP_DATA} from "../ship/ship-data";
import {generatePrismaOperationForCosts} from "../prisma/helper";

export const buildResolvers: Resolvers<AquaContext> = {
    Query: {
        buildOrders: async (_, _1, {prisma, player}) => {
            const buildOrders = await prisma.buildOrder.findMany({where: {ownerId: player.id}});

            return buildOrders.map(order => ({
                ...order,
                //TODO: don't like to do that
                //  Type '"Ship"' is not assignable to type 'BuildOrderType'. -.-'
                type: BuildOrderType[order.type],
                what: ShipName[order.what]
            }))
        }
    },
    Mutation: {
        createBuildOrder: async (_, {input}, {prisma, player}) => {
            const shipName = input.type === BuildOrderType.Ship ? ShipName[input.what] : null;
            const ship = SHIP_DATA.find(ship => ship.name === shipName);

            return prisma.$transaction(async tx => {
                const updatedResources = await tx.resources.update({
                    where: {id: player.station.resources.id},
                    data: generatePrismaOperationForCosts(ship.costs)
                });

                if (updatedResources.aluminium < 0 || updatedResources.steel < 0 || updatedResources.plutonium < 0) {
                    throw new Error('not enough resources');
                }

                const createdBuildOrder = await tx.buildOrder.create({
                    data: {
                        ...input,
                        what: shipName,
                        owner: {connect: {id: player.id}},
                        remainingTime: ship.buildTime || 4
                    }
                })

                return {
                    ...createdBuildOrder,
                    type: BuildOrderType[createdBuildOrder.type],
                    what: ShipName[createdBuildOrder.what]
                }
            });
        }
    }
};