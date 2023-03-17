/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: [
				'ui-rounded',
				"'Hiragino Maru Gothic ProN'",
				'Quicksand',
				'Comfortaa',

				'Manjari',
				'Arial Rounded MT Bold',
				'Calibri',
				'source-sans-pro',
				'sans-serif',
			],
		},
		extend: {
			borderWidth: {
				1: '1px',
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require('@tailwindcss/forms')],
};
