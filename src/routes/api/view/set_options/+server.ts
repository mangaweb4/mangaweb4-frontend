import type { RequestHandler } from './$types';
import { setViewOptions } from '$lib/view_options.server';
import { ImageQuality } from '$lib/grpc/types';
import { $enum } from 'ts-enum-util';

export const GET: RequestHandler = async ({ request, cookies, url }) => {
	const disableAnimation = url.searchParams.get('disableAnimation') ?? 'false';
	const grayscale = url.searchParams.get('grayscale') ?? 'false';
	const quality = $enum(ImageQuality).getValueOrDefault(
		url.searchParams.get('quality'),
		ImageQuality.HIGH
	);

	setViewOptions(cookies, {
		disableAnimation: disableAnimation == 'true',
		grayscale: grayscale == 'true',
		quality: quality
	});

	return new Response(JSON.stringify({ success: true }));
};
