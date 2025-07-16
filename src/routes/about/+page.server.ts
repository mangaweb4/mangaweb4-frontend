import type { PageServerLoad } from './$types';
import { variables } from '$lib/variables';

export const load: PageServerLoad = async ({ url }) => {
    return {
        basePath: variables.apiBasePath
    }
}