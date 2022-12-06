import {PrismaClient} from "@prisma/client";
import {Player} from "./resolvers-types";

export interface AquaContext {
    player: Player,
    prisma: PrismaClient
}