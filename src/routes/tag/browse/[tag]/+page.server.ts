import type { PageServerLoad } from '../$types';
import { variables } from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { Filter, SortField, SortOrder } from '$lib/grpc/types';
import { $enum } from 'ts-enum-util';
import logger from '$lib/logger';
import { ITEM_PER_PAGE } from '$lib/constants';

export const load: PageServerLoad = async ({ request, url, cookies, params }) => {
    const tag = decodeURIComponent(params.tag)

    const searchParams = url.searchParams;
    const user = getUser(request, cookies);
    const filter = $enum(Filter).getValueOrDefault(searchParams.get('filter'), Filter.UNKNOWN);
    const sort = $enum(SortField).getValueOrDefault(searchParams.get('sort'), SortField.NAME);
    const order = $enum(SortOrder).getValueOrDefault(
        searchParams.get('order'),
        (() => {
            {
                switch (sort) {
                    default:
                        return SortOrder.ASCENDING

                    case SortField.CREATION_TIME:
                    case SortField.LAST_UPDATE:
                        return SortOrder.DESCENDING
                }
            }
        })(),
    );
    const page = parseInt(searchParams.get('page') ?? '0')
    const search = searchParams.get('search') ?? "";

    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)

    let call = await client.list({
        user: user,
        tag: tag,
        filter: filter,
        page: page,
        itemPerPage: ITEM_PER_PAGE,
        search: search,
        sort: sort,
        order: order
    })

    logger.debug(call.request, "browse request")
    logger.debug(call.response, "browse response")

    return { request: call.request, response: call.response }
};


