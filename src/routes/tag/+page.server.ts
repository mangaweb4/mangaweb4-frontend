import type { PageServerLoad } from './$types';
import { getUser } from '$lib/user.server';
import { variables } from '$lib/variables.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { TagClient } from '$lib/grpc/tag.client';
import { SortOrder, SortField, Filter } from '$lib/grpc/types';
import { $enum } from 'ts-enum-util';
import type { Cookies } from '@sveltejs/kit';

export const prerender = false;

function createDefaultRequest(request: Request, cookies: Cookies): {
    user: string;
    filter: Filter;
    order: SortOrder;
    sort: SortField;
    search: string;
    page: number;
    item_per_page: number;
} {
    return {
        user: getUser(request, cookies),
        search: "",
        filter: Filter.UNKNOWN,
        page: 0,
        item_per_page: 30,
        order: SortOrder.ASCENDING,
        sort: SortField.NAME,
    };
}

export const load: PageServerLoad = async ({ request, url, cookies }) => {
    let { user, search, filter, page, item_per_page, order, sort } 
        = createDefaultRequest(request, cookies);

    const params = url.searchParams;
    if (params.has('sort')) {
        sort = $enum(SortField)
            .getValueOrDefault(params.get('sort'), SortField.NAME);
    }

    if (params.has('order')) {
        order = $enum(SortOrder)
            .getValueOrDefault(params.get('order'), SortOrder.ASCENDING);
    }

    if (url.searchParams.has('filter')) {
        filter = $enum(Filter).getValueOrDefault(params.get('filter'), Filter.UNKNOWN);
    }
    if (url.searchParams.has('page')) {
        const v = url.searchParams.get('page')
        if (v != null)
            page = parseInt(v)
    }
    if (url.searchParams.has('item_per_page')) {
        const v = url.searchParams.get('item_per_page')
        if (v != null)
            item_per_page = parseInt(v, 10)
    }
    if (url.searchParams.has('search')) {
        const v = url.searchParams.get('search')
        if (v != null)
            search = v
    }

    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new TagClient(transport)
    const call = await client.list({
        user: user,
        filter: filter,
        page: page,
        itemPerPage: item_per_page,
        search: search,
        sort: sort,
        order: order
    })

    return {
        request: call.request,
        response: call.response,
    };
};