import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";
import {generatePrismaOperationForShips} from "../prisma/database.helper";
import {MAX_FLEETS_PER_PLAYER} from "../config";
import {isFleetBusy} from "./index";
import {calculateDistance} from "../resource";

export const fleetResolvers: Resolvers<AquaContext> = {
    Query: {
        fleets: async (_, _1, {prisma, player}) => {
            return prisma.fleet.findMany({where: {ownerId: player.id}, include: {ships: true}});
        }
    },
    Mutation: {
        createFleet: async (_, _1, {prisma, player}) => {
            const numberOfFleets = await prisma.fleet.count({where: {ownerId: player.id, baseFleet: false}})
            if (numberOfFleets >= MAX_FLEETS_PER_PLAYER) {
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
        startFleet: async (_, {input}, {prisma, player}) => {
            const fleetToStart = await prisma.fleet.findFirstOrThrow({where: {ownerId: player.id}});
            const ownStation = await prisma.station.findFirstOrThrow({
                where: {ownerId: player.id},
                include: {resources: true}
            });
            if (isFleetBusy(fleetToStart)) {
                throw new Error("The fleet is still on a mission. Wait until it's back home")
            }

            const targetStation = await prisma.station.findFirstOrThrow({
                where: {coordinates: input.coordinates},
                include: {coordinates: true}
            });

            const distance = calculateDistance(player.station.coordinates, targetStation.coordinates);

            //TODO: calculate fuel depending on distance and ships
            const fuel = 1000
            if (ownStation.resources.plutonium <= fuel) {
                throw new Error("not enough plutonium to start fleet");
            }

            await prisma.station.update({
                where: {id: ownStation.id},
                data: {resources: {update: {plutonium: {decrement: fuel}}}}
            });

            //TODO: calculate travel time depending on distance and ship speed
            const travelTime = distance;

            return prisma.fleet.update({
                where: {id: fleetToStart.id},
                data: {
                    travelTime,
                    returning: false,
                    remainingTime: travelTime,
                    actionTicks: input.actionTicks,
                    action: input.action
                },
                include: {ships: true}
            })
        },
        recallFleet: async (_, {id}, {prisma, player}) => {
            const fleetToRecall = await prisma.fleet.findFirstOrThrow({where: {id}});
            if (fleetToRecall.returning || !fleetToRecall.action) {
                // already returning or not on a mission
                throw new Error("You cannot recall this fleet");
            }

            //TODO: calculate fuel depending on distance and ships
            const remainingFuel = 500;

            return prisma.fleet.update({
                where: {id},
                data: {
                    returning: true,
                    remainingTime: fleetToRecall.travelTime - fleetToRecall.remainingTime,
                    actionTicks: 0,
                    resources: {update: {plutonium: {increment: remainingFuel}}}
                },
                include: {ships: true}
            })
        },
        deleteFleet: async (_, {id}, {prisma, player}) => {
            const fleetToDelete = await prisma.fleet.findFirst({where: {ownerId: player.id}, include: {ships: true}});
            if (isFleetBusy(fleetToDelete)) {
                throw new Error("The fleet is still on a mission. You can only dissolve fleets when they are at home")
            }

            const baseFleet = await prisma.fleet.findFirst({
                where: {ownerId: player.id, baseFleet: true},
                include: {ships: true}
            });
            await prisma.fleet.delete({where: {id}});
            return prisma.ships.update({
                where: {id: baseFleet.ships.id},
                data: generatePrismaOperationForShips(fleetToDelete.ships, 'increment')
            })
        }
    }
};