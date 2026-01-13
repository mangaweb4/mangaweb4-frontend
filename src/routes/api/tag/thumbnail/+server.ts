import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import variables from '$lib/variables.server';
import { TagClient } from '$lib/grpc/tag.client';

export const GET: RequestHandler = async ({ url }) => {
	const transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	const client = new TagClient(transport);

	const id = parseInt(url.searchParams.get('id') ?? '');

	const { response } = await client.thumbnail({ id });

	return new Response(response.data as BodyInit, {
		headers: {
			'content-type': response.contentType
		}
	});
};
