import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";

export const buildResolvers: Resolvers<AquaContext> = {
    Query: {
        buildOrders: async (_, _1, {prisma, player}) => {
            return prisma.buildOrder.findMany({where: {ownerId: player.id}})
        }
    },
    Mutation: {
        createBuildOrder: async (_, {input}, {prisma, player}) => {
            //TODO: get build time from game data
            return prisma.buildOrder.create({
                data: {
                    ...input,
                    owner: {connect: {id: player.id}},
                    remainingTime: 4
                }
            })
        }
    }
};