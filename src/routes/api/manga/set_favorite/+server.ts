import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url, cookies }) => {
	const transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	const client = new MangaClient(transport);
	const user = getUser(request, cookies);
	const favorite = url.searchParams.get('favorite')?.toLocaleLowerCase() == 'true';
	const id = parseInt(url.searchParams.get('id') ?? '');

	if (id == 0 || Number.isNaN(id)) {
		error(404);
	}

	const { response } = await client.setFavorite({
		id: id,
		user,
		favorite
	});

	return new Response(JSON.stringify(response));
};
