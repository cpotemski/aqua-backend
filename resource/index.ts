import {PrismaClient} from "@prisma/client";
import {Coordinates, ResourceNode, ResourceType} from "../resolvers-types";
import {ResourceIncome} from "../tick/elements/resource-income.tick";

//TODO: dynamically scale map size depending on player count
const MAP_SIZE = 100;

//TODO: dynamically scale resource node count depending on player count
const RESOURCE_NODE_COUNT = 100;
export const generateResourceNodes = async (prisma: PrismaClient) => {
    const resourceNodes = await prisma.resourceNode.findMany();
    let count = resourceNodes.length;
    console.log(`${count}/${RESOURCE_NODE_COUNT} resource nodes generated`);
    const resources = Object.values(ResourceType);
    while (count < RESOURCE_NODE_COUNT) {
        const coordinates: Coordinates = await findEmptyCoordinates(prisma);
        await prisma.resourceNode.create({
            data: {
                type: resources[Math.floor(Math.random() * resources.length)],
                coordinates: {create: coordinates}
            }
        })
        count++;
    }
}

const findEmptyCoordinates = async (prisma: PrismaClient): Promise<Coordinates> => {
    let coordinates, x, y;
    do {
        x = Math.ceil(Math.random() * MAP_SIZE);
        y = Math.ceil(Math.random() * MAP_SIZE);
        coordinates = await prisma.coordinates.findFirst({where: {x, y}});
    } while (coordinates)

    return {x, y};
}

export const calculateDistance = (a: Coordinates, b: Coordinates): number => {
    return Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2));
}

export const findNearestResourceNodes = (nodes: ResourceNode[], coordinates: Coordinates) => {
    let nearestNodes: {distance: number, type: ResourceType, node: ResourceNode}[] = [];
    Object.values(ResourceType).forEach(type => nearestNodes.push({distance: 100000, type, node: undefined}));
    nodes.forEach(node => {
        const distance = calculateDistance(node.coordinates, coordinates);
        const nearestNode = nearestNodes.find(n => n.type === node.type);
        if(nearestNode && nearestNode.distance < distance) {
            return;
        }
        nearestNode.distance = distance;
        nearestNode.node = node;
    })

    return {
        [ResourceType.Aluminium]: nearestNodes.find(node => node.type === ResourceType.Aluminium),
        [ResourceType.Steel]: nearestNodes.find(node => node.type === ResourceType.Steel),
        [ResourceType.Plutonium]: nearestNodes.find(node => node.type === ResourceType.Plutonium),
    }
}