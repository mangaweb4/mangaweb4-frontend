import type { PageServerLoad } from './$types';
import variables from '$lib/variables.server';
import { redirect } from '@sveltejs/kit';
import { browseURL, tagURL } from '$lib/routes';

export const load: PageServerLoad = async ({ url }) => {
	switch (variables().homepage) {
		default:
			redirect(307, browseURL(url.origin));
			break;

		case 'TAG_LIST':
			redirect(307, tagURL(url.origin));
			break;

		case 'BROWSE':
			redirect(307, browseURL(url.origin));
			break;
	}
};
