import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	const client = new MangaClient(transport);

	const id = parseInt(url.searchParams.get('id') ?? '');
	if (id == 0 || Number.isNaN(id)) {
		error(404);
	}

	const { response } = await client.repair({ id: id });

	return new Response(JSON.stringify(response));
};
