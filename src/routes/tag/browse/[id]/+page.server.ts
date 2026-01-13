import type { PageServerLoad } from './$types';
import variables from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { Filter, SortField, SortOrder } from '$lib/grpc/types';
import { $enum } from 'ts-enum-util';
import logger from '$lib/logger';
import { ITEM_PER_PAGE } from '$lib/constants';
import { TagClient } from '$lib/grpc/tag.client';

export const load: PageServerLoad = async ({ request, url, cookies, params }) => {
	const id = parseInt(params.id ?? '');

	const searchParams = url.searchParams;
	const user = getUser(request, cookies);
	const filter = $enum(Filter).getValueOrDefault(searchParams.get('filter'), Filter.UNKNOWN);
	const sort = $enum(SortField).getValueOrDefault(
		searchParams.get('sort'),
		variables().defaultBrowseSortField
	);
	const order = $enum(SortOrder).getValueOrDefault(
		searchParams.get('order'),
		variables().defaultBrowseSortOrder
	);
	const page = parseInt(searchParams.get('page') ?? '0');
	const search = searchParams.get('search') ?? '';

	const transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	const client = new TagClient(transport);

	const call = await client.detail({
		user: user,
		id: id,
		filter: filter,
		page: page,
		itemPerPage: ITEM_PER_PAGE,
		search: search,
		sort: sort,
		order: order
	});

	logger.debug(call.request, 'browse request');
	logger.debug(call.response, 'browse response');

	return { request: call.request, response: call.response };
};
