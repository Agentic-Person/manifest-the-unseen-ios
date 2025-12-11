import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'aged-gold': '#C4A052',
        'amber-glow': '#D4A84B',
        'crown-purple': '#6B4C9A',
        'burnished-bronze': '#8B6914',

        // Dark mode backgrounds
        'deep-void': '#0A0A0F',
        'temple-stone': '#1A1A24',
        'elevated': '#22222E',

        // Text colors
        'enlightened': '#F5F0E6',
        'muted-wisdom': '#A09080',
        'subtle': '#6B6B6B',

        // Chakra accents
        'deep-teal': '#1a5f5f',
        'heart-emerald': '#2D5A4A',
        'sacral-orange': '#C4702C',
        'root-crimson': '#7A3333',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'Cambria', 'serif'],
        body: ['var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-heading)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-body)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #C4A052 0%, #8B6914 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6B4C9A 0%, #4A3570 100%)',
      },
    },
  },
  plugins: [],
}
export default config
