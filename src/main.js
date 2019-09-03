// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueScrollTo from 'vue-scrollto'
import VueFuse from 'vue-fuse'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  Vue.use(VueScrollTo, {
    duration: 500,
    easing: "ease",
  })

  Vue.use(VueFuse)

  head.meta.push({
    name: 'author',
    content: 'Lila Fuches'
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Poppins&display=swap'
  })

  head.meta.push({
    key: 'og:description',
    name: 'og:description',
    content: `Software for any business, we help companies turn great ideas into awesome products`,
  })

  head.meta.push({
    key: 'twitter:description',
    name: 'twitter:description',
    content: `Software for any business, we help companies turn great ideas into awesome products`,
  })

  router.beforeEach((to, _from, next) => {
    head.meta.push({
      key: 'og:url',
      name: 'og:url',
      content: process.env.GRIDSOME_BASE_PATH + to.path,
    })
    head.meta.push({
      key: 'og:image',
      name: 'og:image',
      content: process.env.GRIDSOME_BASE_PATH + 'static/logo-head.png',
    })
    next()
  })
}


