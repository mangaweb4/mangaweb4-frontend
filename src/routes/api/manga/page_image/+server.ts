import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import { MAX_STREAM_OBJECT_SIZE } from '$lib/constants';
import { error } from '@sveltejs/kit';
import { ImageQuality } from '$lib/grpc/types';

export const GET: RequestHandler = async ({ request, cookies, url }) => {
    let transport = new GrpcTransport({
        host: variables().apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })
    
    let client = new MangaClient(transport)
    let index = parseInt(url.searchParams.get('i') ?? "") || 0
    let user = getUser(request, cookies)
    let id = parseInt(url.searchParams.get('id') ?? "")
    if (id == 0 || Number.isNaN(id)) {
        error(404);
    }

    let stream = client.pageImageStream({ id: id, user, index, quality: ImageQuality.LOW })

    let filename = ""
    let contentType = ""
    let buffer = new ArrayBuffer(0, { maxByteLength: MAX_STREAM_OBJECT_SIZE })

    for await (let message of stream.responses) {
        if (filename == "") {
            filename = message.filename
            contentType = message.contentType
        }

        let offset = buffer.byteLength
        buffer.resize(buffer.byteLength + message.data.length)

        let array = new Uint8Array(buffer, offset, message.data.length)
        array.set(message.data)
    }

    return new Response(buffer, {
        headers: {
            'content-type': contentType,
            'content-disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
            'content-length': `${buffer.byteLength}`
        }
    })
};
