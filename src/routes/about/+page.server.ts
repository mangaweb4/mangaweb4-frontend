import type { PageServerLoad } from './$types';
import variables from '$lib/variables.server';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { SystemClient } from '$lib/grpc/system.client'
import { version } from '$app/environment'
import logger from '$lib/logger';

export const load: PageServerLoad = async ({ url }) => {
    let transport = new GrpcTransport({
        host: variables().apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    const client = new SystemClient(transport)
    const backendInfo = await client.info({})

    logger.debug(backendInfo.request, "backend information request")
    logger.debug(backendInfo.response, "backend information response")

    return {
        frontend: {
            version: version
        },
        backend: backendInfo.response,
    }
}