/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: '#fff6f9',
          50: '#ffffff',
          100: '#fff6f9',
          200: '#ffedf3',
        },
        petal: {
          DEFAULT: '#ffe4ed',
          dark: '#ffd1e1',
          hover: '#fecddc',
        },
        line: '#f7cfdd',
        rose: {
          DEFAULT: '#f28fb0',
          light: '#fde8ef',
          dark: '#e07297',
        },
        berry: {
          DEFAULT: '#d6336c',
          hover: '#c2255c',
          dark: '#b02458',
          light: '#fa5252',
        },
        plum: {
          DEFAULT: '#3a1b29',
          muted: '#5e3848',
          light: '#7d5265',
        },
        muted: {
          DEFAULT: '#8c6676',
          foreground: '#a57f90',
        },
        success: {
          DEFAULT: '#2f9e72',
          light: '#e6f7f0',
          border: '#a3e4cb',
          dark: '#24835e',
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pink-subtle': '0 2px 10px rgba(214, 51, 108, 0.05)',
        'pink-sm': '0 4px 14px rgba(214, 51, 108, 0.08)',
        'pink-md': '0 10px 28px rgba(214, 51, 108, 0.12)',
        'pink-lg': '0 20px 40px rgba(214, 51, 108, 0.16)',
        'pink-glow': '0 0 24px rgba(214, 51, 108, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
