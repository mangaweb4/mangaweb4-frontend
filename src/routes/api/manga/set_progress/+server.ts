import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { variables } from '$lib/variables.server';
import { getUser } from '$lib/user.server';

export const GET: RequestHandler = async ({ request, cookies }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)
    const url = new URL(request.url)

    let id = parseInt(url.searchParams.get('id') ?? "") ?? 0
    let user = getUser(request, cookies)
    let page = Number.parseInt(url.searchParams.get('page') ?? "") ?? 0

    let { response } = await client.setProgress({ iD: id, name: '', user, page })

    return new Response(JSON.stringify(response));
};
