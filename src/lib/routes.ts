import { $enum } from "ts-enum-util";
import { Filter, SortField, SortOrder } from "./grpc/types";

export function aboutURL(base: URL | string): URL {
    return new URL("/about", base);
}

export function historyURL(base: URL | string): URL {
    return new URL("/history", base);
}

export function viewURL(base: URL | string, name: string): URL {
    var u = new URL("/view", base);
    u.searchParams.set('name', name)

    return u;
}

export function userURL(base:URL| string): URL {
    return new URL("/user", base)
}

export function tagURL(base: URL | string, options?: {
    user?: string;
    tag?: string;
    filter?: Filter;
    page?: number;
    itemPerPage?: number;
    search?: string;
    sort?: SortField;
    order?: SortOrder;
}): URL {
    const output = new URL("/tag", base);
    if (options != null) {
        const { page, filter, search, order, sort } = options;

        if (page != null) {
            output.searchParams.set('page', `${page}`);
        }

        if (filter != null) {
            output.searchParams.set('filter', $enum(Filter).getKeyOrDefault(filter, "UNKNOWN"));
        }

        if (search != null) {
            output.searchParams.set('search', search);
        }

        if (order != null) {
            output.searchParams.set('order', $enum(SortOrder).getKeyOrDefault(order, "ASCENDING"));
        }

        if (sort != null) {
            output.searchParams.set('sort', $enum(SortField).getKeyOrDefault(sort, "NAME"));
        }

    }
    return output;
}

export function browseURL(base: URL | string, options?: {
    user?: string;
    filter?: Filter;
    item_per_page?: number;
    order?: SortOrder;
    page?: number;
    search?: string;
    sort?: SortField;
    tag?: string;
}): URL {
    const output = new URL("/browse", base);

    if (options != null) {
        const { filter, item_per_page, order, page, search, sort, tag } = options;

        if (filter != null) {
            output.searchParams.set('filter', $enum(Filter).getKeyOrDefault(filter, "UNKNOWN"));
        }
        if (item_per_page != null) {
            output.searchParams.set('item_per_page', `${item_per_page}`);
        }
        if (order != null) {
            output.searchParams.set('order', $enum(SortOrder).getKeyOrDefault(order, "ASCENDING"));
        }
        if (page != null) {
            output.searchParams.set('page', `${page}`);
        }

        if (search != null) {
            output.searchParams.set('search', search);
        }

        if (sort != null) {
            output.searchParams.set('sort', $enum(SortField).getKeyOrDefault(sort, "NAME"));
        }

        if (tag != null) {
            output.searchParams.set('tag', tag);
        }
    }

    return output;
}

export function loginUrl(baseUrl: URL | string, targetUrl: URL | string) {
    const target = targetUrl.toString().substring(baseUrl.toString().length + 1)

    const loginUrl = new URL("/login", baseUrl)
    loginUrl.searchParams.set('target', target)

    return loginUrl
}