import { createRemoteJWKSet, jwtVerify } from 'jose';

// Clerk Frontend API derived from the publishable key
const CLERK_ISSUER = 'https://sunny-krill-44.clerk.accounts.dev';
const JWKS = createRemoteJWKSet(
    new URL(`${CLERK_ISSUER}/.well-known/jwks.json`)
);

export type ClerkClaims = {
    sub: string;
    iss: string;
    [k: string]: unknown;
};

/**
 * Verify a Clerk session token. Throws if invalid/expired.
 * Returns the user id (sub) on success.
 */
export async function verifyClerkToken(
    token: string | undefined | null
): Promise<string> {
    if (!token) throw new Error('UNAUTHORIZED: missing token');
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: CLERK_ISSUER,
            clockTolerance: 60
        });
        if (!payload.sub) throw new Error('UNAUTHORIZED: no subject');
        return payload.sub;
    } catch (e) {
        throw new Error(`UNAUTHORIZED: ${(e as Error).message}`);
    }
}

/** Throws if the request does not carry a valid Clerk bearer token. */
export async function requireClerkOwner(
    token: string | undefined | null
): Promise<string> {
    return verifyClerkToken(token);
}
