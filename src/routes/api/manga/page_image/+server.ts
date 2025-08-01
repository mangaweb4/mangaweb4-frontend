import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import { variables } from '$lib/variables.server';
import { getUser } from '$lib/user.server';
import path from 'path';
import fs from 'fs-extra'
import * as os from 'os'

export const GET: RequestHandler = async ({ request, cookies }) => {
    let transport = new GrpcTransport({
        host: variables.apiBasePath,
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new MangaClient(transport)
    const url = new URL(request.url)

    let name = url.searchParams.get('name') ?? ""
    let iStr = url.searchParams.get('i')
    let index = iStr ? parseInt(iStr) : 0
    let user = getUser(request, cookies)
    let stream = client.pageImageStream({ name, user, index, width: 0, height: 0 })

    let filename = ""
    let contentType = ""
    let filepath = ""
    const dir = path.join(os.tmpdir(), "_download")

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
        headers: {
            'content-type': contentType,
            'content-disposition': `attachment; filename="${filename}"`,
        }
    })
};
