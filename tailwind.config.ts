import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'serif': ['var(--font-serif-bungee)'],
      'sans': ['var(--font-sans-koho)']
    },

    extend: {
      colors: {
        primary: "#027373",
        primaryLight: "#029797",
        primaryBackground: "rgba(2, 115, 115, 0.2)",
        primaryAbout: "#CEE0DD",
        orangeish: "rgba(255, 129, 57, 1)",
        figma: "#F24E1E",
        yellowish: "#FFE49A",
      },

      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(18rem, 24rem))',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
