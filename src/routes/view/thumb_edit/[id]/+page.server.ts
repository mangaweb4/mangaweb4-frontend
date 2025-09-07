import type { PageServerLoad } from '../$types';
import { getUser } from '$lib/user.server';
import variables from '$lib/variables.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load: PageServerLoad = async ({ request, cookies, params }) => {
    const { id } = params;

    const user = getUser(request, cookies);

    let transport = new GrpcTransport({
        host: variables().apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    });

    let client = new MangaClient(transport)

    const idValue = parseInt(id);
    if (id == 0 || Number.isNaN(idValue)) {
        error(404);
    }

    const call = await client.detail({
        id: idValue,
        user: user,
    })

    return {
        request: call.request,
        response: call.response,
    };
};