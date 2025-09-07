import * as jose from 'jose'
import { redirect, type Cookies } from '@sveltejs/kit'
import { loginUrl } from './routes'
import variables from './variables.server'
import logger from '$lib/logger'

const JWKS = variables().oidcEnable ? jose.createRemoteJWKSet(new URL(variables().oidc.jwks)) : null

export async function validateSessionWithHeader(url: URL, request: Request) {
    if (!variables().oidcEnable) {
        return;
    }

    if (!JWKS) {
        return
    }

    const authorization = request.headers.get("Authorization")
    if (authorization == null) {
        return
    }

    const parts = authorization.split(' ')
    if (parts.length != 2) {
        throw Error("invalid authorization error")
    }

    const method = parts[0].trim()
    const accessToken = parts[1].trim()

    if (method != "Bearer") {
        throw Error("invalid authorization method")
    }

    try {
        const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: variables().oidc.issuer,
            audience: variables().oidc.client,
        })

        logger.debug({ payload, protectedHeader }, "verify JWT token")

    } catch (err: any) {
        throw Error("invalid access token")
    }

}

export async function validateSession(url: URL, cookies: Cookies) {
    if (!variables().oidcEnable) {
        logger.debug("OIDC not enable.")
        return;
    }

    if (!JWKS) {
        logger.error("JWKS is missing")
        return
    }

    logger.debug({ url, cookies }, "validate session")

    const idToken = cookies.get("idToken")
    const accessToken = cookies.get("accessToken")

    if (idToken == null || accessToken == null) {
        logger.debug({ idToken, accessToken }, 'token missing.')

        redirect(307, loginUrl(url.origin, "/"))
    }

    try {
        const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: variables().oidc.issuer,
            audience: variables().oidc.client,
        })

        logger.debug({ payload, protectedHeader }, "verify JWT token")
    } catch (err: any) {
        logger.debug(err, 'validate JWT error')
        redirect(307, loginUrl(url.origin, url))
    }
}