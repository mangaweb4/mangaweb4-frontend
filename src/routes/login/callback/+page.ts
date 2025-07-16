import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { updateToken } from "$lib/auth";
import { variables } from "$lib/variables";

export const load: PageLoad = async ({ url, fetch }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        throw new Error("Authorization code not found in URL");
    }
    const target = url.searchParams.get('target')

    const targetUrl = new URL(target ?? '/', url.origin)
    const resp = await fetch(
        variables.oidcToken,
        {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: variables.oidcClient,
                client_secret: variables.oidcSecret,
                code: code,
                redirect_uri: new URL("/login/callback", url.origin).toString()
            })
        });

    const tokens = await resp.json();
    updateToken(tokens.access_token, tokens.id_token);

    redirect(307, targetUrl);
}