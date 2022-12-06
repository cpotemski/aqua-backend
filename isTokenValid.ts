import {JwksClient} from "jwks-rsa";
import * as jwt from 'jsonwebtoken';
import {User} from "auth0";

/**
 * Implemented as explained here:
 * https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/#Securing-a-GraphQL-Server-with-Auth0
 */

const client = new JwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    if (!header.kid) {
        callback(new Error('no kid present'));
        return;
    }

    client.getSigningKey(header.kid, function (error, key) {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

export type TokenUser = {
    iss: string
    sub: string
    aud: string[]
    iat: number
    exp: number
    azp: string
    scope: string
}

export async function isTokenValid(token?: string): Promise<TokenUser> {
    if (!token) {
        throw Error("no token provided");
    }

    const bearerToken = token.split(" ");

    const result: Promise<TokenUser> = new Promise((resolve, reject) => {
        jwt.verify(
            bearerToken[1],
            getKey,
            {
                //audience: process.env.API_IDENTIFIER,
                issuer: `https://${process.env.AUTH0_DOMAIN}/`,
                algorithms: ["RS256"]
            },
            (error, decoded) => {
                if (error) {
                    reject({error});
                }
                if (decoded) {
                    resolve(decoded as any);
                }
            }
        );
    });

    return result;
}