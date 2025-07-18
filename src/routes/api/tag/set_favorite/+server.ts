import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { variables } from '$lib/variables.server';
import { TagClient } from '$lib/grpc/tag.client';
import { getUser } from '$lib/user.server';

export const GET: RequestHandler = async ({ request, cookies }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new TagClient(transport)
    const url = new URL(request.url)

    let name = url.searchParams.get('name') ?? ""
    let user = getUser(request, cookies)
    let favorite = url.searchParams.get('favorite')?.toLowerCase() == "true"

    let { response } = await client.setFavorite({ tag: name, user, favorite })

    return new Response(JSON.stringify(response));
};
