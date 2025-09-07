import { redirect } from "@sveltejs/kit";
import variables from "$lib/variables.server";
import type { PageServerLoad } from "./$types";
import { browseURL } from "$lib/routes";
import logger from "$lib/logger";

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
    if (!variables().oidcEnable) {
        logger.debug("OIDC not enable. redirect to browse page")
        redirect(307, browseURL(url.origin))
    }

    cookies.delete("accessToken", { path: "/" })
    cookies.delete("idToken", { path: "/" })

    logger.debug("Redirect to OIDC logout page")
    redirect(307, variables().oidcLogout);
}