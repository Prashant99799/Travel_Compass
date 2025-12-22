import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'summer-start': '#ffecd2',
        'summer-end': '#fcb69f',
        'monsoon-start': '#667eea',
        'monsoon-end': '#764ba2',
        'autumn-start': '#ff9a56',
        'autumn-end': '#ff6a88',
        'winter-start': '#a1c4fd',
        'winter-end': '#c2e9fb',
      },
      backgroundImage: {
        'gradient-summer': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'gradient-monsoon': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-autumn': 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
        'gradient-winter': 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropFilter: {
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [],
} satisfies Config
