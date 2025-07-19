import * as jose from 'jose'
import { redirect, type Cookies } from '@sveltejs/kit'
import { browseURL, loginUrl } from './routes'
import { variables } from './variables.server'
import logger from '$lib/logger'

const JWKS = variables.oidcEnable ? jose.createRemoteJWKSet(new URL(variables.oidcJWKS)) : null

export async function validateSessionWithHeader(url: URL, request: Request) {
    if(!variables.oidcEnable) {
        return;
    }

    if (!JWKS) {
        return
    }

    const authorization = request.headers.get("Authorization")
    if (authorization == null) {
        return
    }

    const regex = /Bearer (.*)/
    const matches = regex.exec(authorization)

    if (matches == null || matches.length < 2){
        throw new Error("invalid Authorization header")
    }

    const accessToken = matches[1]

    try {
        const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: variables.oidcIssuer,
            audience: variables.oidcClient,
        })

    } catch (err: any) {
        logger.debug(err, 'validate JWT error')
        throw new Error("invalid Authorization header")
    }

}

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
        logger.debug(err, 'validate JWT error')
        redirect(307, loginUrl(url.origin, url))
    }
}