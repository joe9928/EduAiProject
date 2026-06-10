// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn semantic tokens — used by shadcn components
        background:  'oklch(var(--background) / <alpha-value>)',
        foreground:  'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT:    'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT:    'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT:    'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        border:      'oklch(var(--border) / <alpha-value>)',
        input:       'oklch(var(--input) / <alpha-value>)',
        ring:        'oklch(var(--ring) / <alpha-value>)',
        destructive: {
          DEFAULT:    'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },

        // EduLearn brand aliases
        // These map to the SAME CSS variables so they stay in sync
        // Your existing components keep working unchanged
        ice: {
          DEFAULT: 'oklch(var(--foreground) / <alpha-value>)',
          50:      'oklch(var(--ice-50) / <alpha-value>)',
          100:     'oklch(var(--foreground) / <alpha-value>)',
          200:     'oklch(var(--ice-200) / <alpha-value>)',
          300:     'oklch(var(--ice-300) / <alpha-value>)',
        },
        spark: {
          DEFAULT: 'oklch(var(--spark) / <alpha-value>)',
        },
        ocean: {
          950: 'oklch(var(--ocean-950) / <alpha-value>)',
          900: 'oklch(var(--ocean-900) / <alpha-value>)',
          800: 'oklch(var(--ocean-800) / <alpha-value>)',
          700: 'oklch(var(--primary) / <alpha-value>)',
          600: 'oklch(var(--ocean-600) / <alpha-value>)',
          500: 'oklch(var(--ocean-500) / <alpha-value>)',
          400: 'oklch(var(--ocean-400) / <alpha-value>)',
          300: 'oklch(var(--ocean-300) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
      },
      animation: {
        float:        'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
}

export default config