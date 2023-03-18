/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		// fontFamily: {
		// 	sans: [
		// 		'ui-rounded',
		// 		"'Hiragino Maru Gothic ProN'",
		// 		'Quicksand',
		// 		'Comfortaa',

		// 		'Manjari',
		// 		'Arial Rounded MT Bold',
		// 		'Calibri',
		// 		'source-sans-pro',
		// 		'sans-serif',
		// 	],
		// },
		extend: {
			borderWidth: {
				1: '1px',
			},
			fontWeight: {
				'extra-light': 200,
				light: 300,
				normal: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require('@tailwindcss/forms')],
};
