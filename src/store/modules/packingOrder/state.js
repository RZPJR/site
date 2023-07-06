const state = {
    packing_order_list: {
        isLoading: false,
        filter:{
            search: '',
            select_warehouse : '',
            statuses:999,
            status2:[
            {
                text:'All Status',
                value:999
            },
            {
                text:'Active',
                value:1
            },
            {
                text:'Finished',
                value:2
            },
            {
                text:'Cancelled',
                value:3
            },
            ],
            delivery_date: {
            input: new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
            model: '',
            value: [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)]
            }
        },
        table_headers: [
            {
                text:'Packing Code',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Site',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Delivery Date',
                class: 'grey--text text--darken-4',
                width: "15%",
                sortable: false
            },
            {
                text:'Note',
                class: 'grey--text text--darken-4',
                width: "25%",
                sortable: false
            },
            {
                text:'Status',
                class: 'grey--text text--darken-4',
                width: "3%",
                sortable: false
            },
            {
                width: "2%",
                class: 'grey--text text--darken-4',
                sortable: false
            },
        ],
        data:[],
    },

    packing_order_detail:{
        isLoading: false,
        table_headers: [
            {
                text:'Product',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'UOM',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Progress(%)',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Pack(0.25 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(0.5 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(1 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(2 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(5 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(10 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Pack(20 KG)',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
        ],
        data : {
            region: {
                name: ''
            },
            site: {
                name: ''
            },
            packing_recommendation: [{
                item: {
                    uom: {
                        name: ''
                    }
                }
            }]
        },
        weigh_scale: {}
    },

    packing_order_create: {
        form : {
            delivery_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
            site_id:"",
            region_id: "",
            note:"",
        },
    },

    pack_list: {
        isLoading: false,
        filter: {
            search: '',
            select_warehouse : '',
            select_product: '',
            packing_date: {
                input: new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                model: '',
                value: [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
            }
        },
        table_headers: [
            {
                text:'Packing Order Code',
                class: 'grey--text text--darken-4',
                sortable: false,
            },
            {
                text:'Site',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Pack Code',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Item',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'UOM',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Expected Size',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Actual Size',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Packing Date',
                class: 'grey--text text--darken-4',
                sortable: false
            },
            {
                text:'Status',
                class: 'grey--text text--darken-4',
                width: "10%",
                sortable: false
            },
            {
                width: "5%",
                class: 'grey--text text--darken-4',
                sortable: false
            },
        ],
        data: [],
    }
};

export default state;
