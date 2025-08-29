import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { variables } from '$lib/variables.server';

export const GET: RequestHandler = async ({ url }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)

    let { response } = await client.thumbnail(
        {
            iD: parseInt(url.searchParams.get('id') ?? ""),
            name: ''
        })

    return new Response(response.data, {
        headers: {
            'content-type': response.contentType,
        },
    });
};
