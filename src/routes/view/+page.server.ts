import type { PageServerLoad } from './$types';
import { getUser } from '$lib/user';
import { variables } from '$lib/variables';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { validateSession } from '$lib/auth';

export const prerender = false;

export const load: PageServerLoad = async ({ request, url }) => {
    const params = url.searchParams;
    
    let name = ''
    if (params.has('name')) {
        name = params.get('name') as string;
    }

    const user = getUser(request);

    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)

    const call = await client.detail({
        name: name,
        user: user,
    })

    return {
        request: call.request,
        response: call.response,
    };
};