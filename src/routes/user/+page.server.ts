import type { PageServerLoad } from "./$types";
import { getUserDetail } from "$lib/user.server";
import { variables } from "$lib/variables.server";

export const load: PageServerLoad = async ({ request, url, cookies }) => {
   const user = getUserDetail(request, cookies)

   return { ...user, logoutURL: variables.oidcLogout }
}

export const prerender = false;