import {Resources, ResourceType} from "../resolvers-types";

export const generatePrismaOperationForCosts = (costs: Resources, method: 'increment' | 'decrement' = 'decrement') => {
    const operation: {aluminium?: object, steel?: object, plutonium?: object, id?: object, __typename?: object} = { };

    Object.keys(ResourceType).forEach(resource => {
        const resourceName = resource.toLowerCase() as keyof Resources;
        if(costs[resourceName]) {
            operation[resourceName] = {[method]: costs[resourceName]}
        }
    })

    return operation
}