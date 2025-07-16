import { validateSession } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    await validateSession(event.url)

    const response = await resolve(event);
    return response;
};