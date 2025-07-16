import type { PageServerLoad } from "./$types";
import { validateSession } from "$lib/auth";
import { getUserDetail } from "$lib/user";
import { variables } from "$lib/variables";

export const load: PageServerLoad = async ({ request, url }) => {
   const user = getUserDetail(request)

   return { ...user, logoutURL: variables.oidcLogout }
}

export const prerender = false;