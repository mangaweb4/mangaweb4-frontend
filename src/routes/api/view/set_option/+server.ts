import type { RequestHandler } from './$types';
import { setViewOptions } from '$lib/view_options.server';

export const GET: RequestHandler = async ({ request, cookies }) => {
    const options = await request.json()

    setViewOptions(cookies, options);

    return new Response(JSON.stringify({ success: true }));
};
