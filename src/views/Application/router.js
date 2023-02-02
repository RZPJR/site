export default [
    {
        path: '/configuration/application',
        name: 'Application',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Application List'
        }
    },
    {
        path: '/configuration/application/update/:id',
        name: 'ApplicationUpdate',
        component: () => import("./Update.vue"),
        meta: {
            auth: true,
            title: 'Application Update',
            breadcrumbs : [
                {
                    text: 'Application List',
                    to : '/configuration/application'
                },
                {
                    text: 'Application Update',
                },
            ],
        }
    },
]