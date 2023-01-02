import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";
import {generatePrismaOperationForShips} from "../prisma/database.helper";
import { MAX_FLEETS_PER_PLAYER } from "../config";

export const fleetResolvers: Resolvers<AquaContext> = {
    Query: {
        fleets: async (_, _1, {prisma, player}) => {
            return prisma.fleet.findMany({where: {ownerId: player.id}, include: {ships: true}});
        }
    },
    Mutation: {
        createFleet: async (_, _1, {prisma, player}) => {
            const numberOfFleets = await prisma.fleet.count({where: {ownerId: player.id, baseFleet: false}})
            if(numberOfFleets >= MAX_FLEETS_PER_PLAYER) {
                throw new Error("You already have the maximum number of fleets");
            }
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
        },
        deleteFleet: async (_, {id}, {prisma, player}) => {
            const baseFleet = player.fleets.find(fleet => fleet.baseFleet);
            const fleetToDelete = player.fleets.find(fleet => fleet.id === id);
            if(fleetToDelete.actionTicks || fleetToDelete.remainingTime || fleetToDelete.returning) {
                throw new Error("The fleet is still on a mission. You can only dissolve fleets when they are at home")
            }
            await prisma.fleet.delete({where: {id}});
            return prisma.ships.update({where: {id: baseFleet.ships.id}, data: generatePrismaOperationForShips(fleetToDelete.ships, 'increment')})
        }
    }
};