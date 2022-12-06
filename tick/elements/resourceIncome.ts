import {TickElement} from "../tick-element.model";
import {PrismaClient} from "@prisma/client";

export const ResourceIncome: TickElement = {
    name: 'resourceIncome',
    async tick(prisma: PrismaClient) {
        await prisma.resources.updateMany({
            where: {NOT: {station: null}}, data: {
                aluminium: {increment: 100},
                steel: {increment: 100},
                plutonium: {increment: 100}
            }
        });
    }
}