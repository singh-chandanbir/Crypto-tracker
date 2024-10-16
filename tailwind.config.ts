import type { Config } from 'tailwindcss'

const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        bakbak: ['"Bakbak One"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      'purple': '#db00ff',
      'background': '#222222',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      cyan: colors.cyan
    }
  },
  plugins: [],
}
export default config
