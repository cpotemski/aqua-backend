import {Resources, ResourceType} from "../resolvers-types";

export const generatePrismaOperationForCosts = (costs: Resources) => {
    const operation: {aluminium?: object, steel?: object, plutonium?: object, id?: object, __typename?: object} = { };

    Object.keys(ResourceType).forEach(resource => {
        const resourceName = resource.toLowerCase() as keyof Resources;
        if(costs[resourceName]) {
            operation[resourceName] = {decrement: costs[resourceName]}
        }
    })

    return operation
}