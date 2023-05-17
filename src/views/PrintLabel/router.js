export default [
    {
        path: '/site/print-label-picking',
        name: 'PrintLabelPicking',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Print Label Picking'
        }
    },
  ]  