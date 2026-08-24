import type {Config} from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#060711',
                    surface: '#0c0d1c',
                    panel: '#16182c',
                    panelHover: '#1e203a',
                    gold: '#f7d436',
                    danger: '#eb1212',
                },
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
            keyframes: {
                statusPing: {
                    '75%, 100%': {
                        transform: 'scale(2)',
                        opacity: '0',
                    },
                },
            },
            animation: {
                statusPing: 'statusPing 1.4s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
        },
    },
    plugins: [],
}

export default config
