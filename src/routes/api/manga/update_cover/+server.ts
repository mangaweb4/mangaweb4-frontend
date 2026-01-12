import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import type { URLSearchParams } from 'url';
import { error } from '@sveltejs/kit';

function parseParamInt(name: string, searchParams: URLSearchParams) {
	let str = searchParams.get(name);
	return str ? parseInt(str) : 0;
}

export const GET: RequestHandler = async ({ url }) => {
	let transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	let client = new MangaClient(transport);

	let id = parseInt(url.searchParams.get('id') ?? '');
	if (id == 0 || Number.isNaN(id)) {
		error(404);
	}
	let index = parseParamInt('i', url.searchParams);
	let x = parseParamInt('x', url.searchParams);
	let y = parseParamInt('y', url.searchParams);
	let width = parseParamInt('w', url.searchParams);
	let height = parseParamInt('h', url.searchParams);

	let { response } = await client.updateCover({
		id: id,
		index,
		x,
		y,
		width,
		height
	});

	return new Response(JSON.stringify(response));
};
