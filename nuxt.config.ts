export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    'nuxt-rating',
    'nuxt-cron',
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
  cron: {
    runOnInit: true,
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
