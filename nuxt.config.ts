export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  nitro: {
    experimental: {
      websocket: true,
      tasks: true,
      database: true,
    },
  },
  $production: {
    nitro: {
      database: {
        default: {
          connector: 'bun'
        }
      }
    }
  }
})
