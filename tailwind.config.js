/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {

        container: {
            center: true,
        },
        extend: {
            colors: {
                "main-color": "#35AFA0",
                "second-color": "#00B853",
                "text-color": "#202435",
                "btn-color": "#FFCD00",
            }
        },
    },
    plugins: [
        require('flowbite/plugin'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}


