import {AquaContext} from "../aqua-context.model";
import {Resolvers} from "../resolvers-types";
import {SHIP_DATA} from "./ship-data";

export const shipResolvers: Resolvers<AquaContext> = {
    Query: {
        shipData: () => SHIP_DATA
    }
};