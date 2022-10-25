/* eslint-disable nuxt/no-cjs-in-config */
// const config = require('./.contentful.json')
import * as contentful from 'contentful'
import * as config from './.contentful.json'
// const contentful = require('contentful')
const client = contentful.createClient({
  space: config.CTF_SPACE_ID,
  accessToken: config.CTF_CDA_ACCESS_TOKEN,
})
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'my_blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  // contentful setting
  env: {
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~plugins/font-awesome', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    'nuxt-fontawesome',
  ],
  // 追加module markdownit とfontawesomeの設定
  markdownit: {
    html: true,
    injected: true,
    linkify: true,
    breaks: false,
  },
  fontawesome: {
    component: 'fa',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  generate: {
    routes() {
      return Promise.all([
        client.getEntries({
          content_type: 'work',
        }),
        client.getEntries({
          content_type: 'category',
        }),
        client.getEntries({
          content_type: 'tag',
        }),
      ]).then(([works, categories, tags]) => {
        return [
          ...works.items.map((work) => `work/${work.fields.slug}`),
          ...categories.items.map(
            (category) => `category/${category.fields.slug}`
          ),
          ...tags.items.map((tag) => `tag/${tag.sys.id}`),
        ]
      })
    },
  },
}
