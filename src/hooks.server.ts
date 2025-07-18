import { validateSession } from '$lib/auth.server';
import type { Handle, ServerInit } from '@sveltejs/kit';
import logger from '$lib/logger';
import { setLogger } from '@grpc/grpc-js/build/src/logging';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {

    // '/url' handler handles anything related to authentication. 
    // Skip the validation to make sure the authentication is performed.
    if (!event.url.pathname.startsWith('/login') && 
        !event.url.pathname.startsWith('/logout') && 
        !event.url.pathname.startsWith('/.well-known')) {
        await validateSession(event.url, event.cookies)
    }
    const response = await resolve(event);
    return response;
};

export const init: ServerInit = async () => {
    logger.level = env.LOG_LEVEL ?? 'info'
    setLogger(logger)
}