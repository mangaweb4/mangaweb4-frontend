import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import type { RequestHandler } from './$types';
import { ChannelCredentials } from '@grpc/grpc-js';
import { MangaClient } from '$lib/grpc/manga.client';
import variables from '$lib/variables.server';
import { MAX_STREAM_OBJECT_SIZE } from '$lib/constants';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const transport = new GrpcTransport({
		host: variables().apiBasePath,
		channelCredentials: ChannelCredentials.createInsecure()
	});

	const client = new MangaClient(transport);

	const id = parseInt(url.searchParams.get('id') ?? '');
	if (id == 0 || Number.isNaN(id)) {
		error(404);
	}

	const stream = client.download({ id: id });

	let filename = '';
	let contentType = '';
	const buffer = new ArrayBuffer(0, { maxByteLength: MAX_STREAM_OBJECT_SIZE });

	for await (const message of stream.responses) {
		if (filename == '') {
			filename = message.filename;
			contentType = message.contentType;
		}

		const offset = buffer.byteLength;
		buffer.resize(buffer.byteLength + message.data.length);

		const array = new Uint8Array(buffer, offset, message.data.length);
		array.set(message.data);
	}

	return new Response(buffer, {
		headers: {
			'content-type': contentType,
			'content-disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
			'content-length': `${buffer.byteLength}`
		}
	});
};
