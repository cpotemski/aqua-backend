import {PrismaClient} from '@prisma/client';
import {ApolloServer, AuthenticationError} from 'apollo-server';
import {join} from 'path';
import {Resolvers} from './resolvers-types';
import {loadSchemaSync} from '@graphql-tools/load';
import 'dotenv/config';
import {isTokenValid} from './isTokenValid';
import {AquaContext} from './aqua-context.model';
import {merge} from 'lodash';
import {playerResolvers} from "./player/player.resolvers";
import {buildResolvers} from "./build/build.resolvers";
import {shipResolvers} from "./ship/ship.resolvers";
import {resourceResolvers} from "./resource/resource.resolvers";
import {generateResourceNodes} from "./resource";
import {startTick} from "./tick";
import {fleetResolvers} from "./fleet/fleet.resolvers";
import {stationResolvers} from "./station/station.resolvers";
import { TICK_ACTIVE } from './config';

const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');

const typeDefs = loadSchemaSync(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers<AquaContext> = merge(
    playerResolvers,
    buildResolvers,
    shipResolvers,
    resourceResolvers,
    fleetResolvers,
    stationResolvers
);

const prisma: PrismaClient = new PrismaClient();

const server = new ApolloServer({
    resolvers, typeDefs, context: async ({req}) => {
        const token = req.headers.authorization

        const tokenUser = await isTokenValid(token);

        if (!tokenUser) {
            throw new AuthenticationError('authorization header invalid');
        }

        const player = await prisma.player.findFirst({where: {id: tokenUser.sub}});

        return {player, prisma};
    },
});

server.listen({port: 4000}).then(async () => {
    console.log('server started');

    await generateResourceNodes(prisma);
    if(TICK_ACTIVE) {
        startTick(prisma);
    }
})
