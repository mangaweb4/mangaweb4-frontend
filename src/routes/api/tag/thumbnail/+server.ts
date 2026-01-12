import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import variables from '$lib/variables.server';
import { TagClient } from '$lib/grpc/tag.client';

export const GET: RequestHandler = async ({ request, url }) => {
	let transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	let client = new TagClient(transport);

	let id = parseInt(url.searchParams.get('id') ?? '');

	let { response } = await client.thumbnail({ id });

	return new Response(response.data as BodyInit, {
		headers: {
			'content-type': response.contentType
		}
	});
};
