export default [
  {
      path: '/site/print-label',
      name: 'MultiPurposePrint',
      component: () => import("./Index.vue"),
      meta: {
          auth: true,
          title: 'Multi Purpose Print'
      }
  },
]