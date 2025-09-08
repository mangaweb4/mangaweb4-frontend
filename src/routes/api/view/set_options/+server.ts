import type { RequestHandler } from './$types';
import { setViewOptions } from '$lib/view_options.server';

export const GET: RequestHandler = async ({ request, cookies, url }) => {
    const disableAnimation = url.searchParams.get('disableAnimation') ?? 'false'
    const grayscale = url.searchParams.get('grayscale') ?? 'false'

    setViewOptions(cookies, {
        disableAnimation: disableAnimation == 'true',
        grayscale: grayscale == 'true'
    });

    return new Response(JSON.stringify({ success: true }));
};
