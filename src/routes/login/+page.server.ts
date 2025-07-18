import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { variables } from "$lib/variables.server";
import { browseURL } from "$lib/routes";
import logger from "$lib/logger";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const target = url.searchParams.get('target')

    if (!variables.oidcEnable) {
        logger.debug("oidc not enable. redirect to browse page")
        redirect(307, target ?? browseURL(url.origin))
    }

    const oidpUrl = new URL(variables.oidcAuth)
    oidpUrl.searchParams.set('response_type', 'code')
    oidpUrl.searchParams.set('scope', 'openid email profile')
    oidpUrl.searchParams.set('client_id', variables.oidcClient)
    oidpUrl.searchParams.set('redirect_uri', new URL("/login/callback", url.origin).toString())
    oidpUrl.searchParams.set('state', target ?? browseURL(url.origin).toString())

    redirect(307, oidpUrl)
}