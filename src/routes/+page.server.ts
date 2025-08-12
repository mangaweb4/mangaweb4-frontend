import type { PageServerLoad } from './$types';
import { variables } from '$lib/variables.server';
import { redirect } from '@sveltejs/kit'
import { browseURL, loginUrl } from '$lib/routes'
import logger from '$lib/logger';

export const load: PageServerLoad = async ({ url }) => {
    redirect(307, browseURL(url.origin))
}