import {
	createAppleSplashScreens,
	defineConfig,
	minimal2023Preset
} from '@vite-pwa/assets-generator/config';

const preset = minimal2023Preset;
preset.transparent.resizeOptions = {
	fit: 'contain',
	background: '#222222'
};
preset.maskable.resizeOptions = {
	fit: 'contain',
	background: '#222222'
};

preset.apple.resizeOptions = {
	fit: 'contain',
	background: '#222222'
};

preset.appleSplashScreens = createAppleSplashScreens(
	{
		// padding: 0.3,
		resizeOptions: { fit: 'contain', background: '#222222' },
		linkMediaOptions: {
			log: true,
			addMediaScreen: true,
			xhtml: true
		}
	},
	['iPad Air 9.7"']
);

export default defineConfig({
	headLinkOptions: {
		preset: '2023'
	},
	preset: preset,
	images: 'static/favicon.svg'
});
