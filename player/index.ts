import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";

export const playerResolvers: Resolvers<AquaContext> = {
    Query: {
        me: async (_, _1, {prisma, player}) => {
            return player;
        },
        playerById: async (_, {id}, {prisma}) => {
            return prisma.player.findFirst({
                where: {id}
            });
        },
        allPlayers: async (_, _1, {prisma}) => {
            return prisma.player.findMany();
        }
    },
    Mutation: {
        register: async (_, {input}, {prisma}) => {
            return await prisma.player.create({
                data: {
                    id: input.id,
                    email: input.email,
                    name: input.name,
                    station: {
                        create: {
                            name: input.stationName,
                            resources: {
                                create: {
                                    aluminium: 1000,
                                    steel: 1000,
                                    plutonium: 1000,
                                    energy: 100
                                }
                            },
                            coordinates: {create: input.coordinates}
                        }
                    },
                    fleets: {
                        create: {
                            baseFleet: true,
                            ships: {
                                create: {}
                            }
                        }
                    }
                }
            })
        }
    }
};