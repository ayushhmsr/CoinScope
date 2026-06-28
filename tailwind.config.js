/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'intel': ['"Intel One Mono"', 'monospace'],
      },
      animation: {
        'elegant-entrance': 'elegant-entrance 2s ease-out',
        'gentle-float': 'gentle-float 3s ease-in-out infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out 0.5s both',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'elegant-entrance': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
            filter: 'blur(10px)',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.7',
            filter: 'blur(2px)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
            filter: 'blur(0px)',
          },
        },
        'gentle-float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.4))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 25px rgba(234, 179, 8, 0.8))',
          },
        },
        'breathe': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.03)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
