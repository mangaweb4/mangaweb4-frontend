import { persisted } from 'svelte-persisted-store'
import { get } from 'svelte/store'
import * as jose from 'jose'
import { redirect } from '@sveltejs/kit'
import { loginUrl } from './routes'
import { variables } from './variables'

export const tokens = persisted('preferences', {
    accessToken: '<INVALID>',
    idToken: '<INVALID',
})

const JWKS = variables.oidcEnable ? jose.createRemoteJWKSet(new URL(variables.oidcJWKS)) : null

export async function validateSession(url: URL) {
    if (!variables.oidcEnable) {
        return;
    }

    if (!JWKS) {
        return
    }

    try {
        const { accessToken } = get(tokens);

        const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS, {
            issuer: variables.oidcIssuer,
            audience: variables.oidcClient,
        })

    } catch (err: any) {
        console.log(err.message)
        redirect(307, loginUrl(url.origin, url))
    }
}

export function updateToken(access: string, id: string) {
    tokens.set({
        accessToken: access,
        idToken: id
    })
}