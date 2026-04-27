import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                "surface-variant": "#2d3449", "secondary": "#4edea3", "primary-container": "#3d5afe",
                "surface": "#0b1326", "primary-fixed-dim": "#bbc3ff", "on-tertiary": "#67001b",
                "surface-bright": "#31394d", "inverse-on-surface": "#283044", "surface-container": "#171f33",
                "on-primary-container": "#f1f0ff", "on-primary": "#001d93", "error": "#ffb4ab",
                "on-tertiary-fixed-variant": "#92002a", "on-tertiary-container": "#ffeded", "tertiary-fixed-dim": "#ffb2b7",
                "background": "#0b1326", "surface-container-high": "#222a3d", "primary-fixed": "#dee0ff",
                "on-surface": "#dae2fd", "on-secondary-fixed-variant": "#005236", "on-secondary-fixed": "#002113",
                "primary": "#bbc3ff", "on-error-container": "#ffdad6", "inverse-surface": "#dae2fd",
                "outline-variant": "#444656", "on-secondary-container": "#00311f", "surface-container-low": "#131b2e",
                "on-background": "#dae2fd", "on-secondary": "#003824", "tertiary-container": "#d22348",
                "on-surface-variant": "#c5c5d9", "error-container": "#93000a", "tertiary": "#ffb2b7",
                "outline": "#8e8fa2", "surface-dim": "#0b1326", "on-error": "#690005",
                "on-primary-fixed-variant": "#002ccd", "inverse-primary": "#2848ee", "surface-container-lowest": "#060e20",
                "surface-container-highest": "#2d3449", "tertiary-fixed": "#ffdadb", "secondary-fixed": "#6ffbbe",
                "secondary-fixed-dim": "#4edea3", "surface-tint": "#bbc3ff", "on-tertiary-fixed": "#40000d",
                "secondary-container": "#00a572", "on-primary-fixed": "#000f5d"
            },
            fontFamily: {
                headline: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
                label: ['Inter', ...defaultTheme.fontFamily.sans],
            }
        }
    },
    plugins: [forms, containerQueries],
};