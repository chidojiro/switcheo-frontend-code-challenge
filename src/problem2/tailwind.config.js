/** @type {import('tailwindcss').Config} */

const extendedSize = new Array(300).fill(null).reduce((acc, _, i) => ({ ...acc, [i + 1]: `${(i + 1) * 0.25}rem` }), {
  available: '-webkit-fill-available',
});

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      width: extendedSize,
      height: extendedSize,
      maxWidth: extendedSize,
      maxHeight: extendedSize,
      minWidth: extendedSize,
      minHeight: extendedSize,
      margin: extendedSize,
      padding: extendedSize,
      marginTop: extendedSize,
      marginRight: extendedSize,
      marginBottom: extendedSize,
      marginLeft: extendedSize,
      paddingTop: extendedSize,
      paddingRight: extendedSize,
      paddingBottom: extendedSize,
      paddingLeft: extendedSize,
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      opacity: {
        2: '0.02',
        4: '0.04',
        8: '0.08',
        12: '0.12',
        16: '0.16',
        24: '0.24',
        32: '0.32',
        40: '0.40',
        64: '0.64',
        72: '0.72',
        84: '0.84',
        94: '0.94',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
