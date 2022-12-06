import {PrismaClient} from "@prisma/client";

export interface TickElement {
    name: string | undefined;

    tick(prisma: PrismaClient): void
}