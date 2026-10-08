export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#07060B',
          900: '#0B0A11',
          800: '#121019',
          700: '#1B1824',
          600: '#262230',
        },
        signal: {
          300: '#C4A9FF',
          400: '#A87DFF',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6425D0',
        },
        mist: {
          100: '#F5F4FA',
          300: '#C9C6D6',
          500: '#8F8AA3',
          700: '#5C5770',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'helix-gradient': 'linear-gradient(135deg, #6425D0 0%, #8B5CF6 45%, #C4A9FF 100%)',
        'fade-void': 'linear-gradient(180deg, rgba(7,6,11,0) 0%, #07060B 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.25), 0 8px 30px -8px rgba(139,92,246,0.35)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fillbar: {
          '0%': { width: '0%' },
        },
        pulseglow: {
          '0%,100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        rise: 'rise .5s ease-out both',
        pulseglow: 'pulseglow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
