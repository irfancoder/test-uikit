const plugin = require('tailwindcss/plugin')

module.exports = {
    mode: 'jit',
    // purge: {
    //     enabled: false
    // },
    purge: [
        './src/**/*.{vue,js}'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1281px',
                '2xl': '1536px',
                '3xl': '2560px',
                '4xl': '3840px' // xxl: '1920px'
            },
            borderColor: (theme) => ({
                DEFAULT: theme('colors.gray.500', 'currentColor')
            }),
            borderRadius: {
                none: '0',
                sm: '2px',
                DEFAULT: '4px',
                6: '6px',
                md: '8px',
                lg: '16px',
                full: '9999px'
            },
            boxShadow: {
                DEFAULT: '0 5px 40px 4px rgba(13,36,71,0.16)',
            },
            colors: {
                white: '#ffffff',

                misc: {
                    100: '#727A8E',
                    200: '#6F7983',
                    300: '#37383c',
                    400: '#EEF1F6',
                    500: '#f5f7fa',
                    600: '#7EC1FF',
                    700: '#646e78'
                },

                black: {
                    50: '#ECF0F8',
                    100: '#E5EAF4',
                    200: '#C7C8C8',
                    300: '#A6A6A7',
                    400: '#636465',
                    500: '#202123',
                    600: '#1D1E20',
                    700: '#131415',
                    800: '#0E0F10',
                    900: '#0A0A0B'
                },
                gray: {
                    50: '#ECF0F8',
                    100: '#FAFBFC',
                    200: '#F3F5F8',
                    300: '#ECEFF4',
                    400: '#DDE2EC',
                    500: '#E3E8EE',
                    600: '#BAC1CD',
                    700: '#7C8089',
                    800: '#5D6067',
                    900: '#3E4044'
                },
                red: {
                    50: '#FFF8F8',
                    100: '#FFE0E0',
                    200: '#F9C7C7',
                    300: '#F5A5A5',
                    400: '#EE6161',
                    500: '#E61D1D',
                    600: '#CF1A1A',
                    700: '#8A1111',
                    800: '#680D0D',
                    900: '#450909'
                },
                yellow: {
                    50: '#FFEDD4',
                    100: '#FFEDD4',
                    200: '#FFEACE',
                    300: '#FFDDB1',
                    400: '#FFC476',
                    500: '#FFAB3B',
                    600: '#E69A35',
                    700: '#996723',
                    800: '#734D1B',
                    900: '#4D3312'
                },
                green: {
                    50: '#F5FFFD',
                    100: '#E2FFF8',
                    200: '#BFDFD7',
                    300: '#99CCBF',
                    400: '#4DA690',
                    500: '#008060',
                    600: '#007356',
                    700: '#004D3A',
                    800: '#003A2B',
                    900: '#00261D'
                },
                blue: {
                    50: '#F7FAFF',
                    100: '#D5E3FD',
                    200: '#C5D4F3',
                    300: '#A2BAEC',
                    400: '#5C87DE',
                    500: '#1654D1',
                    600: '#07439E',
                    700: '#0D327D',
                    800: '#0A255E',
                    850: '#102B54',
                    900: '#0D2447'
                }
            },
            fontFamily: {
                sans: [
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    '"Noto Sans"',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"'
                ],
                serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
                mono: [
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    '"Liberation Mono"',
                    '"Courier New"',
                    'monospace'
                ],
                icon: ['runcloudnicon']
            },
            fontSize: {
                xxs: '8px',
                xs: '10px',
                sm: '12px',
                base: '14px',
                lg: '16px',
                xl: '18px',
                '2xl': '24px',
                '3xl': '32px',
                '4xl': '40px',
                '5xl': '48px',
                '6xl': '56px'
            },
            minHeight: (theme, { breakpoints }) => ({
                'half-screen': '50vh',
                ...theme('spacing'),
                ...breakpoints(theme('screens'))
            }),
            maxHeight: {
                '90-screen': '90vh'
            },
            maxWidth: (theme, { breakpoints }) => ({
                none: 'none',
                '3xs': '100px',
                '2xs': '280px',
                xs: '320px',
                sm: '384px',
                md: '448px',
                lg: '512px',
                xl: '576px',
                '2xl': '672px',
                '3xl': '768px',
                '4xl': '896px',
                '5xl': '1024px',
                '6xl': '1152px',
                full: '100%',
                min: 'min-content',
                max: 'max-content',
                prose: '65ch',
                ...breakpoints(theme('screens'))
            }),
            minWidth: (theme, { breakpoints }) => ({
                '0': '0px',
                full: '100%',
                min: 'min-content',
                max: 'max-content',
                ...theme('spacing'),
                ...breakpoints(theme('screens'))
            }),
            spacing: {
                px: '1px',
                '0': '0',
                '0.5': '2px',
                1: '4px',
                2: '8px',
                '2.5': '10px',
                3: '12px',
                '3-5': '14px',
                4: '16px',
                6: '18px',
                '6.5': '20px',
                7: '24px',
                8: '32px',
                10: '40px',
                12: '48px',
                14: '56px',
                16: '64px',
                18: '72px',
                20: '80px',
                24: '96px',
                28: '112px',
                32: '128px',
                36: '144px',
                40: '160px',
                44: '176px',
                48: '192px',
                52: '208px',
                56: '224px',
                60: '240px',
                64: '256px',
                68: '272px',
                72: '288px',
                76: '304px',
                80: '320px',
                84: '336px',
                100: '400px',
                110: '440px',
                120: '480px',
                165: '540px',
                210: '600px',
                240: '720px',
                270: '840px',
                300: '960px'
            },
            zIndex: {
                auto: 'auto',
                1: '1',
                2: '2',
                60: '60',
                70: '70',
                80: '80',
                90: '90',
                100: '100',
                1000: '1000',
                1050: '1050',
                2050: '2050',
                999999: '999999'
            }
        }
    },

    plugins: [
        plugin(function ({ addBase, config }) {
            addBase({
                'html': {
                    fontSize: config('theme.fontSize.base')
                },
                'body': {
                    fontSize: config('theme.fontSize.base'),
                    color: config('theme.colors.black.500'),
                    backgroundColor: config('theme.colors.misc.500')
                },
                'a': {
                    color: config('theme.colors.blue.500'),
                    fontWeight: config('theme.fontWeight.medium')
                },
                'main': {
                    paddingBottom: config('theme.spacing.7')
                },
                'h1': {
                    fontSize: config('theme.fontSize.2xl'),
                    fontWeight: config('theme.fontWeight.bold')
                },
                'h2': {
                    fontSize: config('theme.fontSize.2xl'),
                    fontWeight: config('theme.fontWeight.bold')
                },
                'h3': {
                    fontSize: config('theme.fontSize.lg')
                },
                'h4': {
                    fontSize: config('theme.fontSize.lg')
                },
                'h5': {
                    fontSize: config('theme.fontSize.lg')
                },
                'h6': {
                    fontSize: config('theme.fontSize.base'),
                    fontWeight: config('theme.fontWeight.medium'),
                    color: config('theme.colors.black.500')
                },
                'p': {
                    color: config('theme.colors.misc.700')
                },
                'label': {
                    display: 'inline-block'
                },
                'strong': {
                    fontWeight: config('theme.fontWeight.semibold'),
                    color: config('theme.colors.black.500')
                },
                '.rc-ln-semibold:before': {
                    fontWeight: config('theme.fontWeight.semibold') + ' !important'
                }
            })
        })
    ]
}
