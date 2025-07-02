/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
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
        'support-signal': {
          'teal-light': '#3CD7C4',
          'teal-mid': '#2CC4B7', 
          'teal-deep': '#1798A2',
          'navy': '#0C2D55',
          'bg-grey': '#F4F7FA',
          'cta-blue': '#287BCB',
          'success-green': '#27AE60',
          'alert-amber': '#F2C94C'
        },
      },
      borderRadius: {
        'xs': '6px',   // Small elements, tags
        'sm': '8px',   // Buttons, inputs
        'md': '12px',  // Cards, major containers
        'lg': 'var(--radius)',
        'xl': 'calc(var(--radius) + 4px)',
        'full': '50%', // Icons, avatars
      },
      spacing: {
        'xs': '8px',   // Extra small spacing
        'sm': '12px',  // Small spacing
        'md': '16px',  // Medium spacing
        'lg': '24px',  // Large spacing
        'xl': '32px',  // Extra large spacing
        'xxl': '40px', // Content area padding
        'xxxl': '48px', // Header/footer padding
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      fontSize: {
        'main-title': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'subtitle': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'section-header': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        'caption': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
