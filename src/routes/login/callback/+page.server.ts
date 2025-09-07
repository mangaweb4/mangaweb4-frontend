import { redirect } from "@sveltejs/kit";
import variables from "$lib/variables.server";
import type { PageServerLoad } from "./$types";
import logger from "$lib/logger";

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        throw new Error("Authorization code not found in URL");
    }
    const target = url.searchParams.get('state')

    const targetUrl = new URL(target ?? '/', url.origin)
    const resp = await fetch(
        variables().oidc.token,
        {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: variables().oidc.client,
                client_secret: variables().oidc.secret,
                code: code,
                redirect_uri: new URL("/login/callback", url.origin).toString()
            })
        });

    const tokens = await resp.json();

    cookies.set("accessToken", tokens.access_token, { path: "/" })
    cookies.set("idToken", tokens.id_token, { path: "/" })

    logger.debug({ url, tokens }, "OIDC login callback")
    redirect(307, targetUrl);
}