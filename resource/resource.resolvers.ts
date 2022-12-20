import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";

export const resourceResolvers: Resolvers<AquaContext> = {
    Query: {
        resourceNodes: async (_, _1, {prisma, player}) => {
            return prisma.resourceNode.findMany({include: {coordinates: true}});
        }
    }
};