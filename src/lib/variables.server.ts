import { env } from '$env/dynamic/private';
import { $enum } from 'ts-enum-util';
import { SortField, SortOrder } from './grpc/types';

let variables: {
    apiBasePath: string

    defaultBrowseSortField: SortField
    defaultBrowseSortOrder: SortOrder

    defaultTagSortField: SortField
    defaultTagSortOrder: SortOrder

    oidcEnable: boolean
    oidcClient: string
    oidcSecret: string
    oidcAuth: string
    oidcToken: string
    oidcIssuer: string
    oidcJWKS: string
    oidcLogout: string
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

        defaultBrowseSortField,
        defaultBrowseSortOrder,

        defaultTagSortField,
        defaultTagSortOrder,

        oidcEnable: env.OIDC_ENABLE ? env.OIDC_ENABLE == "true" : false,
        oidcClient: env.OIDC_CLIENT ?? '',
        oidcSecret: env.OIDC_SECRET ?? '',
        oidcAuth: env.OIDC_AUTHORIZE ?? '',
        oidcToken: env.OIDC_TOKEN ?? '',
        oidcIssuer: env.OIDC_ISSUER ?? '',
        oidcJWKS: env.OIDC_JWKS ?? '',
        oidcLogout: env.OIDC_LOGOUT ?? ''
    };

    return variables;
}