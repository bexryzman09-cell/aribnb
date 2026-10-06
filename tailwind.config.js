/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: '#ff385c',
                ink: '#222',
                muted: '#6a6a6a',
                line: '#ddd',
                soft: '#f2f2f2',
                grey: '#ebebeb',
            },
            fontFamily: {
                sans: ['Circular', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(.2,.8,.2,1)',
            },
            keyframes: {
                pop: {
                    from: { opacity: '0', transform: 'translateY(-8px) scale(.98)' },
                },
            },
            animation: {
                pop: 'pop .2s cubic-bezier(.2,.8,.2,1)',
            },
        },
    },
}