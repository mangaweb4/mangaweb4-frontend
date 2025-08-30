import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { variables } from '$lib/variables.server';

export const GET: RequestHandler = async ({ url }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure()
    })

    let client = new MangaClient(transport)

    let id = parseInt(url.searchParams.get('id') ?? "") ?? 0
    let { response } = await client.repair({ id: id })

    return new Response(JSON.stringify(response));
};
