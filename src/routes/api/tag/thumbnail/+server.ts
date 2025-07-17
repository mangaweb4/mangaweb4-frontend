import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { variables } from '$lib/variables.server';
import { TagClient } from '$lib/grpc/tag.client';

export const GET: RequestHandler = async ({ request }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new TagClient(transport)
    const url = new URL(request.url)

    let name = url.searchParams.get('name') ?? ""

    let { response } = await client.thumbnail({ name })

    return new Response(response.data, {
        headers: {
            'content-type': response.contentType,
        },
    });
};
