/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-cyan': '#00d4ff',
        'primary-purple': '#5b2d8c',
        'bg-dark': '#0a0e17',
        'bg-card': '#12161f',
        'bg-card-hover': '#1a1f2e',
        'accent-green': '#6bcb77',
        'accent-yellow': '#ffd93d',
        'accent-red': '#ff6b6b',
        'accent-blue': '#4d96ff'
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'data-flow': 'dataFlow 2s linear infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        dataFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
