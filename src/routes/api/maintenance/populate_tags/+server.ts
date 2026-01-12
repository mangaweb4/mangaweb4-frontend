import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import variables from '$lib/variables.server';
import { MaintenanceClient } from '$lib/grpc/maintenance.client';

export const GET: RequestHandler = async () => {
	let transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	let client = new MaintenanceClient(transport);

	let { response } = await client.populateTags({});

	return new Response(JSON.stringify({ success: response.isSuccess }));
};
