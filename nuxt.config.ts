export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    'nuxt-rating',
    'nuxt-cron',
    '@nuxt/eslint',
    "@nuxt/ui"
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
  cron: {
    runOnInit: false,
    timeZone: 'Asia/Kolkata',
    jobsDir: 'cron',
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