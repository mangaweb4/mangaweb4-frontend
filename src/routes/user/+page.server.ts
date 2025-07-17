import type { PageServerLoad } from "./$types";
import { validateSession } from "$lib/auth.server";
import { getUserDetail } from "$lib/user.server";
import { variables } from "$lib/variables.server";

export const load: PageServerLoad = async ({ request, url }) => {
   const user = getUserDetail(request)

   return { ...user, logoutURL: variables.oidcLogout }
}

export const prerender = false;