import { transform } from 'typescript'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				wiggleslight: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				wiggleshake: {
					'0%, 100%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' }
				},
				tada: {
					'0%': { transform: 'rotate(0)' },
					'25%': { transform: 'rotate(3deg)' },
					'50%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' },
					'100%': { transform: 'rotate(0)' }
				},
				wobble: {
					'0%': { transform: `rotate3d(${Math.sin(0)}, ${Math.cos(0)}, 0, 0)` },
					'50%': {
						transform: `rotate3d(${Math.sin(1)}, ${Math.cos(1)}, 0, 30deg)`
					},
					'100%': {
						transform: `rotate3d(${Math.sin(0)}, ${Math.cos(0)}, 0, 0)`
					}
				},
				'shrink-x': {
					'0%': { transform: 'scaleX(1)' },
					'100%': { transform: 'scaleX(0)' }
				}
			},
			animation: {
				// name | duration | timing-function | direction
				wiggleslight: 'wiggleslight 6s ease-in infinite',
				shake: 'wiggleshake 0.2s ease-in 1',
				tada: 'tada 0.3s ease-in both',
				wobble: 'wobble 1s ease-in both',
				'shrink-x': 'shrink-x 0.2s ease-in 1'
			}
		}
	},
	plugins: []
}
