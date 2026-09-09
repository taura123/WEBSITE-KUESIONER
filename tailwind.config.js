/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tau: {
          blue: {
            deep:    '#0F2560',
            DEFAULT: '#1B3A7A',
            medium:  '#2D5BBF',
            light:   '#4B7BE8',
            pale:    '#EEF3FF',
            soft:    '#F4F7FC',
          },
          white:  '#FFFFFF',
          text:   '#1A1A2E',
          muted:  '#64748B',
          border: '#E2E8F0',
          line:   '#CBD5E1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 4px 24px rgba(27,58,122,0.08)',
        'card-hover': '0 8px 32px rgba(27,58,122,0.14)',
        'btn':   '0 2px 8px rgba(27,58,122,0.20)',
        'nav':   '0 2px 12px rgba(27,58,122,0.08)',
      },
      borderRadius: {
        'xl2': '16px',
        'xl3': '20px',
      }
    },
  },
  plugins: [],
}
