import { Resolvers } from "../resolvers-types";
import {AquaContext} from "../aqua-context.model";

export const stationResolvers: Resolvers<AquaContext> = {
    Query: {
        stations: async (_, _1, {prisma}) => {
            return prisma.station.findMany({include: {coordinates: true, resources: true}});
        }
    },
};