import { redirect } from "@sveltejs/kit";
import { variables } from "$lib/variables.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
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

    cookies.set("accessToken", tokens.access_token, { path: "/" })
    cookies.set("idToken", tokens.id_token, { path: "/" })

    redirect(307, targetUrl);
}