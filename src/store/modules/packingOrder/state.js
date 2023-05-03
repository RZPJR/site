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
        data : [],
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
    },

    weigh_scale: {
        url: '',
        filter: {
            loading: false,
            loadingDispose: false,
            errorSO: false,
            fulfill: false,
            filePdf: '',
            search: 0,
            so_code: '',
            packing_code: '',
            alert: false,
            caution: false,
            dispose: false,
            printed: false,
            callPrint: false,
        },
        websocketSetting: {
            websocket_status: '',
            websocket: null,
            websocketPrint: null,
            connected: false,
            connectedPrint: false,
            checkBrowser: true,
        },
        printSetting: {
            style: 'color: white;',
            icon: '',
            belowWeight:true,
            getTolerance: [],
            stable_weighing_time_second: 0,
            modelWeigh: '',
            manual: false,
            finished: false,
            ipAddress: '127.0.0.1',
            selectWeigh: [
                {
                    text:'WEIGH1',
                    value: 'WEIGH1'
                },
                {
                    text:'WEIGH2',
                    value: 'WEIGH2'
                },
                {
                    text:'WEIGH3',
                    value: 'WEIGH3'
                },
                {
                    text:'WEIGH4',
                    value: 'WEIGH4'
                },
                {
                    text:'WEIGH5',
                    value: 'WEIGH5'
                },
                {
                    text:'WEIGH6',
                    value: 'WEIGH6'
                },
                {
                    text:'WEIGH7',
                    value: 'WEIGH7'
                },
                {
                    text:'WEIGH8',
                    value: 'WEIGH8'
                }
            ],
            modelTime: '1000',
            selectTime: [
                {
                    text: '5 Seconds',
                    value: '1000'
                },
                {
                    text: 'Manual',
                    value: '0'
                }
            ]
        },
        data: {
            product: {
                item: {
                    name: '',
                    item_image:{
                        image_url: ''
                    }
                },
            },
            actual_total_pack: 0,
            expected_total_pack: 0,
            tolerance:0,
            actualData: 0,
            expectedData: 0,
            aboveTolerance: 0,
            belowTolerance: 0,
            packing: [],
            data: 0,
            data2: 0,
            dataStore: [],
        }
    }
};

export default state;
