import {PrismaClient} from '@prisma/client';
import {ApolloServer, AuthenticationError} from 'apollo-server';
import {join} from 'path';
import {Resolvers} from './resolvers-types';
import {loadSchemaSync} from '@graphql-tools/load';
import 'dotenv/config';
import {isTokenValid} from './isTokenValid';
import {AquaContext} from './aqua-context.model';
import {merge} from 'lodash';
import {playerResolvers} from "./player";
import {buildResolvers} from "./build";


const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');

const typeDefs = loadSchemaSync(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
});

const resolvers: Resolvers<AquaContext> = merge(
    playerResolvers,
    buildResolvers
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
server.listen({port: 4000}).then(() => {
    console.log('server started');

    // startTick(prisma);
})
