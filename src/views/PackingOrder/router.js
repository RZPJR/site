export default [
    {
        path: '/site/packing-order',
        name: 'PackingOrderList',
        component: () => import("./Index.vue"),
        meta: {
            auth: true,
            title: 'Packing Order List'
        }
    },
    {
        path: '/site/weigh-scale',
        name: 'WeighScale',
        component: () => import("./WeighScale.vue"),
        meta: {
            auth: true,
            title: 'Weigh Scale'
        }
    },
    {
        path: '/site/pack-list',
        name: 'PackList',
        component: () => import("./PackList.vue"),
        meta: {
            auth: true,
            title: 'Pack List',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/site/packing-order'
                },
                {
                    text: 'Pack List',
                },
            ],
        }
    },
    {
        path: '/site/packing-order/create',
        name: 'PackingOrderCreate',
        component: () => import("./Create"),
        meta: {
            auth: true,
            title: 'Generate Packing Order',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/site/packing-order'
                },
                {
                    text: 'Generate Packing Order',
                },
            ],
        },
        props: true,
    },
    {
        path: '/site/packing-order/detail/:id',
        name: 'PackingOrderDetail',
        component: () => import("./Detail"),
        meta: {
            auth: true,
            title: 'Packing Order Detail',
            breadcrumbs : [
                {
                    text: 'Packing Order List',
                    to : '/site/packing-order'
                },
                {
                    text: 'Packing Order Detail',
                },
            ],
        }
    },
]