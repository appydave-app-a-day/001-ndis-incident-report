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
        // Style guide specific colors
        'primary-blue': 'hsl(var(--primary-blue))',
        'deep-navy': 'hsl(var(--deep-navy))',
        'light-blue': 'hsl(var(--light-blue))',
        'soft-blue': 'hsl(var(--soft-blue))',
        'primary-text': 'hsl(var(--primary-text))',
        'secondary-text': 'hsl(var(--secondary-text))',
        'tertiary-text': 'hsl(var(--tertiary-text))',
        'border-light': 'hsl(var(--border-light))',
        'border-medium': 'hsl(var(--border-medium))',
        'app-background': 'hsl(var(--app-background))',
        'card-background': 'hsl(var(--card-background))',
        'light-background': 'hsl(var(--light-background))',
        'success-green': 'hsl(var(--success-green))',
        'warning-orange': 'hsl(var(--warning-orange))',
        'warning-background': 'hsl(var(--warning-background))',
        'warning-text': 'hsl(var(--warning-text))',
        'error-red': 'hsl(var(--error-red))',
        
        // Shadcn/ui compatibility
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
