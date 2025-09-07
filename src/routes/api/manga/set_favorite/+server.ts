import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url, cookies }) => {
    let transport = new GrpcTransport({
        host: variables().apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)
    let user = getUser(request, cookies)
    let favorite = url.searchParams.get('favorite')?.toLocaleLowerCase() == "true"
    let id = parseInt(url.searchParams.get('id') ?? "")

    if (id == 0 || Number.isNaN(id)) {
        error(404);
    }

    let { response } = await client.setFavorite({
        id: id,
        user,
        favorite
    })

    return new Response(JSON.stringify(response));
};
