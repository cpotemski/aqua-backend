import { Prisma } from "@prisma/client";
import {Resources, ResourceType, ShipName, Ships} from "../resolvers-types";

export const generatePrismaOperationForCosts = (costs: Resources, method: 'increment' | 'decrement' = 'decrement') => {
    const operation: { [resourceT in keyof Omit<Resources, 'id' | '__typename'>]: {[methodT in keyof Prisma.IntFieldUpdateOperationsInput]: number}} = { };

    Object.keys(ResourceType).forEach(resource => {
        const resourceName = resource.toLowerCase() as keyof Omit<Resources, 'id' | '__typename'>;
        if(costs[resourceName]) {
            operation[resourceName] = {[method]: costs[resourceName]}
        }
    })

    return operation
}

export const generatePrismaOperationForShips = (ships: Ships, method: keyof Prisma.IntFieldUpdateOperationsInput = 'decrement') => {
    const operation: { [shipNameT in keyof Omit<Ships, 'id' | '__typename'>]: {[methodT in keyof Prisma.IntFieldUpdateOperationsInput]: number}} = { };

    Object.keys(ShipName).forEach(ship => {
        const shipName = ship.toLowerCase() as keyof Omit<Ships, 'id' | '__typename'>;
        if(ships[shipName]) {
            operation[shipName] = {[method]: ships[shipName]}
        }
    })

    return operation
}