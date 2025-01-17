import { defineClientConfig } from '@vuepress/client'
import Layout from './layouts/Layout.vue'

export default defineClientConfig({
  enhance({ router }) {
    router.addRoute({
      path: '/firmware/:osStr/:uniqueBuild',
      name: 'firmware',
      component: Layout
    })
  },
})