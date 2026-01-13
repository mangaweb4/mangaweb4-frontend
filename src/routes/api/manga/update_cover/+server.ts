import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import type { URLSearchParams } from 'url';
import { error } from '@sveltejs/kit';

function parseParamInt(name: string, searchParams: URLSearchParams) {
	const str = searchParams.get(name);
	return str ? parseInt(str) : 0;
}

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
	const index = parseParamInt('i', url.searchParams);
	const x = parseParamInt('x', url.searchParams);
	const y = parseParamInt('y', url.searchParams);
	const width = parseParamInt('w', url.searchParams);
	const height = parseParamInt('h', url.searchParams);

	const { response } = await client.updateCover({
		id: id,
		index,
		x,
		y,
		width,
		height
	});

	return new Response(JSON.stringify(response));
};
