import { getUser } from '$lib/user.server';
import { variables } from '$lib/variables.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { PageServerLoad } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { HistoryClient } from '$lib/grpc/history.client';
import { ITEM_PER_PAGE } from '$lib/constants';

export const load: PageServerLoad = async ({ request, url, cookies }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new HistoryClient(transport)

    const pageStr = url.searchParams.get('page') ?? "0"
    const page = parseInt(pageStr);
    const user = getUser(request, cookies);

    let call = await client.list({ page: page, user, itemPerPage: ITEM_PER_PAGE })

    return {
        request: call.request,
        response: call.response
    }
};