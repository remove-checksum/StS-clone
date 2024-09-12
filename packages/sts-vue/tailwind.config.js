/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				tada: {
					'0%': { transform: 'rotate(0)' },
					'25%': { transform: 'rotate(3deg)' },
					'50%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' },
					'100%': { transform: 'rotate(0)' }
				},
			},
			animation: {
				// name | duration | timing-function | direction
				tada: 'tada 0.3s ease-in both',
			}
		}
	},
	plugins: []
}
