import type { PageServerLoad } from './$types';
import { variables } from '$lib/variables.server';
import { redirect } from '@sveltejs/kit'
import { browseURL, loginUrl } from '$lib/routes'
import logger from '$lib/logger';

export const load: PageServerLoad = async ({ url, cookies }) => {

    if (variables.oidcEnable) {
        const idToken = cookies.get("idToken")
        const accessToken = cookies.get("accessToken")

        if (idToken == null || accessToken == null) {
            logger.debug('token missing.')

            redirect(307, loginUrl(url.origin, "/"))
        }

    }
    redirect(307, browseURL(url.origin))
}