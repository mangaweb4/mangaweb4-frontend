import type { PageServerLoad } from './$types';
import { variables } from '$lib/variables.server';
import { redirect } from '@sveltejs/kit'
import { browseURL } from '$lib/routes'

export const load: PageServerLoad = async ({ url, cookies }) => {

    const idToken = cookies.get("idToken")
    const accessToken = cookies.get("accessToken")

    if (idToken == null || accessToken == null) {
        logger.info('token missing.')

        redirect(307, loginUrl(url.origin, "/"))
    }

    redirect(307, browseURL(url.origin))
}