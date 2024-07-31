export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
  ],
  hub: {
    cache: true,
  },
  css: ['~~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // https://devtools.nuxt.com
  devtools: {
    enabled: true,
  },
  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
