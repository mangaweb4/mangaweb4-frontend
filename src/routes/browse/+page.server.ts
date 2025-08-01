import type { PageServerLoad } from './$types';
import { variables } from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { Filter, SortField, SortOrder } from '$lib/grpc/types';
import { $enum } from 'ts-enum-util';
import logger from '$lib/logger';

function createDefaultRequest(): {
    user: string;
    filter: Filter;
    item_per_page: number;
    order: SortOrder;
    page: number;
    search: string;
    sort: SortField;
    tag: string;
} {
    let sortField: SortField = $enum(SortField)
        .getValueOrDefault(variables.defaultSortField, SortField.CREATION_TIME)

    let order = SortOrder.DESCENDING
    if (sortField == SortField.NAME) {
        order = SortOrder.ASCENDING
    }

    return {
        user: '',
        filter: Filter.UNKNOWN,
        item_per_page: 30,
        order: order,
        page: 0,
        search: '',
        sort: sortField,
        tag: ''
    };
}

export const load: PageServerLoad = async ({ request, url, cookies }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)

    let { user, filter, item_per_page, order, page, search, sort, tag } = createDefaultRequest();
    user = getUser(request, cookies);

    const params = url.searchParams;
    if (params.has('filter')) {
        filter = $enum(Filter).getValueOrDefault(params.get('filter'), Filter.UNKNOWN);
    }

    if (params.has('sort')) {
        sort = $enum(SortField).getValueOrDefault(params.get('sort'), SortField.NAME);
    }

    if (params.has('order')) {
        order = $enum(SortOrder).getValueOrDefault(params.get('order'), SortOrder.ASCENDING);
    }

    if (params.has('tag')) {
        tag = params.get('tag') as string;
    }

    if (params.has('page')) {
        let v = params.get('page');
        if (v != null) {
            page = parseInt(v);
        }
    }

    if (params.has('search')) {
        let v = params.get('search');
        if (v != null) {
            search = v;
        }
    }

    let call = await client.list({
        user: user,
        tag: tag,
        filter: filter,
        page: page,
        itemPerPage: item_per_page,
        search: search,
        sort: sort,
        order: order
    })

    logger.debug(call.request, "browse request")
    logger.debug(call.response, "browse response")

    return { request: call.request, response: call.response }
};


