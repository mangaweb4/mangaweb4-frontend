import * as jose from 'jose'
import { redirect, type Cookies } from '@sveltejs/kit'
import { browseURL, loginUrl } from './routes'
import { variables } from './variables.server'
import logger from '$lib/logger'

const JWKS = variables.oidcEnable ? jose.createRemoteJWKSet(new URL(variables.oidcJWKS)) : null

export async function validateSession(url: URL, cookies: Cookies) {
    if (!variables.oidcEnable) {
        return;
    }

    if (!JWKS) {
        return
    }

    const idToken = cookies.get("idToken")
    const accessToken = cookies.get("accessToken")

    if (idToken == null || accessToken == null) {
        logger.debug('token missing.')
        
        redirect(307, loginUrl(url.origin, "/"))
    }

    try {
        const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: variables.oidcIssuer,
            audience: variables.oidcClient,
        })

    } catch (err: any) {
        logger.warn(err, 'validate JWT error')
        redirect(307, loginUrl(url.origin, url))
    }
}