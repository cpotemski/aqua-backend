import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";
import {findNearestResourceNodes} from "./index";

export const resourceResolvers: Resolvers<AquaContext> = {
    Query: {
        resourceNodes: async (_, _1, {prisma, player}) => {
            return prisma.resourceNode.findMany({include: {coordinates: true}});
        },
        nearestResourceNodes: async (_, {coordinates}, {prisma}) => {
            const nodes = await prisma.resourceNode.findMany({include: {coordinates: true}});
            return findNearestResourceNodes(nodes, coordinates);
        }
    },
    Mutation: {
        updateHarvesterDistribution: async (_, {input}, {prisma, player}) => {
            return prisma.station.update({
                where: {ownerId: player.id},
                data: input,
                include: {resources: true, coordinates: true}
            })
        }
    }
};