import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { variables } from '$lib/variables.server';
import * as os from 'os'
import path from 'path';
import fs from 'fs-extra'

export const GET: RequestHandler = async ({ request }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
        clientOptions: {
            "grpc.max_receive_message_length": 2 * 1024 * 1024
        }
    })

    let client = new MangaClient(transport)
    const url = new URL(request.url)

    let name = url.searchParams.get('name') ?? ""

    let stream = client.download({ name })
    const dir = path.join(os.tmpdir(), "_download")

    let filename = ""
    let contentType = ""
    let filepath = ""
    for await (let message of stream.responses) {
        if (filename == "") {
            filename = message.filename
            contentType = message.contentType

            filepath = path.join(dir, filename)
            
            if (fs.existsSync(filepath)) {
                fs.rmSync(filepath)
            }

            fs.ensureFileSync(filepath)
        }

        fs.appendFileSync(filepath, message.data)
    }

    return new Response(fs.readFileSync(filepath), {
        headers:{
            'content-type': contentType,
            'content-disposition': `attachment; filename="${filename}"` ,
        }
    })
};
