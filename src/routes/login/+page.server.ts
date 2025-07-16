import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { variables } from "$lib/variables";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const target = url.searchParams.get('target')
    if (target == null) {
        return
    }

    const oidpUrl = new URL(variables.oidcAuth)
    oidpUrl.searchParams.set('response_type', 'code')
    oidpUrl.searchParams.set('scope', 'openid email profile')
    oidpUrl.searchParams.set('client_id', variables.oidcClient)
    oidpUrl.searchParams.set('redirect_uri', new URL("/login/callback", url.origin).toString())
    oidpUrl.searchParams.set('state', target)

    redirect(307, oidpUrl)
}