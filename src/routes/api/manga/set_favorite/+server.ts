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

    let name = url.searchParams.get('name') ?? ""
    let user = getUser(request, cookies)
    let favorite = url.searchParams.get('favorite')?.toLocaleLowerCase() == "true"

    let { response } = await client.setFavorite({ name, user, favorite })

    return new Response(JSON.stringify(response));
};
