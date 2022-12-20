import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";

export const fleetResolvers: Resolvers<AquaContext> = {
    Query: {
        fleets: async (_, _1, {prisma, player}) => {
            return prisma.fleet.findMany({where: {ownerId: player.id}, include: {ships: true}});
        }
    },
    Mutation: {
        createFleet: async (_, _1, {prisma, player}) => {
            return prisma.fleet.create({
                data: {
                    owner: {
                        connect: {id: player.id}
                    },
                    ships: {
                        create: {}
                    }
                },
                include: {ships: true}
            });
        }
    }
};