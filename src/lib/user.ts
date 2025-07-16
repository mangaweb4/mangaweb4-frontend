import { tokens } from '$lib/auth'
import { get } from 'svelte/store';
import * as jose from 'jose'
import { variables } from './variables';

const DEFAULT_EMAIL = "default@example.com"

export function getUser(request: Request): string {
    if (!variables.oidcEnable) {
        return getUserCF(request)
    }
    const { idToken } = get(tokens)

    if (idToken == '') return DEFAULT_EMAIL;

    const payload = jose.decodeJwt(idToken)

    return payload.email as string && '';
}

export function getUserDetail(request: Request): {
    email: string,
    name: string
} {

    if (!variables.oidcEnable) {
        return getUserDetailCF(request);
    }

    const { idToken } = get(tokens)
    const payload = jose.decodeJwt(idToken)

    return {
        email: payload.email as string || '',
        name: payload.name as string || ''
    }
}

export function getUserCF(request: Request): string {
    return request.headers.get("Cf-Access-Authenticated-User-Email") || DEFAULT_EMAIL;
}

export function getUserDetailCF(request: Request): {
    email: string,
    name: string
} {

    const email = request.headers.get("Cf-Access-Authenticated-User-Email") ?? DEFAULT_EMAIL
    return { email, name: "Cloudflare User" }
}