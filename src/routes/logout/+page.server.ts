import { redirect } from "@sveltejs/kit";
import { variables } from "$lib/variables.server";
import type { PageServerLoad } from "./$types";
import { browseURL } from "$lib/routes";

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
    if (!variables.oidcEnable) {
        redirect(307, browseURL(url.origin))
    }

    cookies.delete("accessToken", { path: "/" })
    cookies.delete("idToken", { path: "/" })

    redirect(307, variables.oidcLogout);
}