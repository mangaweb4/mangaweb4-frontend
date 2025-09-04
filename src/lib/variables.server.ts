import { env } from '$env/dynamic/private';
import { $enum } from 'ts-enum-util';
import { SortField, SortOrder } from './grpc/types';

let variables: {
    apiBasePath: string
    homepage: string

    defaultBrowseSortField: SortField
    defaultBrowseSortOrder: SortOrder

    defaultTagSortField: SortField
    defaultTagSortOrder: SortOrder

    oidcEnable: boolean
    oidc: {
        client: string
        secret: string
        auth: string
        token: string
        issuer: string
        jwks: string
        logout: string
    }
} | null = null;

export default function getVariables() {
    if (variables != null) return variables;
    const defaultBrowseSortField = $enum(SortField)
        .getValueOrDefault(env.DEFAULT_BROWSE_SORT_FIELD ?? env.DEFAULT_SORT_FIELD, SortField.CREATION_TIME);

    const defaultBrowseSortOrder = $enum(SortOrder)
        .getValueOrDefault(
            env.DEFAULT_BROWSE_SORT_ORDER ?? env.DEFAULT_ORDER,
            defaultBrowseSortField == SortField.NAME ? SortOrder.ASCENDING : SortOrder.DESCENDING);

    const defaultTagSortField = $enum(SortField)
        .getValueOrDefault(env.DEFAULT_TAG_SORT_FIELD ?? env.DEFAULT_SORT_FIELD, SortField.LAST_UPDATE);
    const defaultTagSortOrder = $enum(SortOrder)
        .getValueOrDefault(
            env.DEFAULT_TAG_SORT_ORDER ?? env.DEFAULT_ORDER,
            defaultBrowseSortField == SortField.NAME ? SortOrder.ASCENDING : SortOrder.DESCENDING
        );

    variables = {
        apiBasePath: env.BACKEND_URL ?? 'localhost:8972',
        homepage: env.HOMEPAGE ?? "BROWSE",

        defaultBrowseSortField,
        defaultBrowseSortOrder,

        defaultTagSortField,
        defaultTagSortOrder,

        oidcEnable: env.OIDC_ENABLE ? env.OIDC_ENABLE == "true" : false,
        oidc: {
            client: env.OIDC_CLIENT ?? '',
            secret: env.OIDC_SECRET ?? '',
            auth: env.OIDC_AUTHORIZE ?? '',
            token: env.OIDC_TOKEN ?? '',
            issuer: env.OIDC_ISSUER ?? '',
            jwks: env.OIDC_JWKS ?? '',
            logout: env.OIDC_LOGOUT ?? ''
        }
    };

    return variables;
}