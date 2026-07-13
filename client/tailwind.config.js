/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        // Primary brand palette
        navy: {
          DEFAULT: '#160400', // --N
          light: '#2d0b04',
          dark: '#0d0200',
        },
        gold: {
          DEFAULT: '#C9A56A', // --G
          light: '#E4CEA8',
          dark: '#8B6B3D',
          pale: '#F2E7D0',
        },
        burgundy: {
          DEFAULT: '#8B1C1C', // --B
          light: '#A52A2A',
          dark: '#5A0808',
        },
        // Light luxury backgrounds
        cream: {
          DEFAULT: '#FAF5F0', // --C
          dark: '#E0D5C8', // --BR
          muted: '#7A7065', // --M
        },
        offwhite: '#FAF5F0', // --C
        warmcream: '#F2EBE1', // --O
        border: '#E0D5C8', // --BR
        charcoal: '#2C2C2C',
        muted: '#7A7065', // --M
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        jost: ['Jost', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,165,106,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(201,165,106,0.3)' },
        },
        luxReveal: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 4s ease-in-out infinite',
        goldShimmer: 'goldShimmer 3s linear infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        luxReveal: 'luxReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg,rgba(22,4,0,0.7) 0%,rgba(22,4,0,0.4) 45%,rgba(22,4,0,0.82) 100%),linear-gradient(135deg,#3A1508 0%,#6B2E0A 22%,#8B4A15 42%,#5C2A0C 62%,#2E1408 82%,#1A0A04 100%)',
        'cta-gradient': 'linear-gradient(180deg,rgba(22,4,0,0.9) 0%,rgba(22,4,0,0.78) 100%),linear-gradient(135deg,#5C0D0D 0%,#3D1A08 50%,#1A0A04 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(201,165,106,0.12) 0%, rgba(22,4,0,0) 70%)',
        'luxury-gradient': 'linear-gradient(135deg, #C9A56A 0%, #E4CEA8 50%, #C9A56A 100%)',
        'surface-gradient': 'linear-gradient(180deg, #F2EBE1 0%, #FAF5F0 100%)',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
