import * as jose from 'jose';
import variables from './variables.server';
import type { Cookies } from '@sveltejs/kit';

const DEFAULT_EMAIL = 'default@example.com';

export function getUser(request: Request, cookies: Cookies): string {
	if (!variables().oidcEnable) {
		return getUserCF(request);
	}
	const idToken = cookies.get('idToken');

	if (idToken == null) {
		return DEFAULT_EMAIL;
	}

	const payload = jose.decodeJwt(idToken);

	return (payload.email as string) ?? '';
}

export function getUserDetail(
	request: Request,
	cookies: Cookies
): {
	email: string;
	name: string;
} {
	if (!variables().oidcEnable) {
		return getUserDetailCF(request);
	}

	const idToken = cookies.get('idToken');
	if (idToken == null) {
		throw Error('invalid idToken');
	}
	const payload = jose.decodeJwt(idToken);

	return {
		email: (payload.email as string) ?? '',
		name: (payload.name as string) ?? ''
	};
}

function getUserCF(request: Request): string {
	return request.headers.get('Cf-Access-Authenticated-User-Email') ?? DEFAULT_EMAIL;
}

function getUserDetailCF(request: Request): {
	email: string;
	name: string;
} {
	const email = request.headers.get('Cf-Access-Authenticated-User-Email') ?? DEFAULT_EMAIL;
	return { email, name: 'An User' };
}
