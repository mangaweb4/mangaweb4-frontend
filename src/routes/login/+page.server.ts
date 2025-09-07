import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import variables from "$lib/variables.server";
import logger from "$lib/logger";

export const load: PageServerLoad = async ({ url }) => {
    const target = url.searchParams.get('target') ?? url.origin.toString()

    if (!variables().oidcEnable) {
        logger.debug("OIDC not enable. redirect to browse page")
        redirect(307, target)
    }

    const oidpUrl = new URL(variables().oidc.auth)
    oidpUrl.searchParams.set('response_type', 'code')
    oidpUrl.searchParams.set('scope', 'openid email profile')
    oidpUrl.searchParams.set('client_id', variables().oidc.client)
    oidpUrl.searchParams.set('redirect_uri', new URL("/login/callback", url.origin).toString())
    oidpUrl.searchParams.set('state', target)

    logger.debug(oidpUrl, "OIDC login")
    redirect(307, oidpUrl)
}