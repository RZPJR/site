const state = {
    checker_weigh_scale: {
        url: '',
        filter: {
            loading: false,
            filter: false,
            finished: false,
            callPrint: false,
            printed: false,
            dispose: false,
            caution: false,
            alert: false,
            scanned: false,
            search: 0,
            so_code: '',
            packing_code: '',
            search_prd: '',
            product_id: '',
            message: '',
            ticker: 0,
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
            tolerance:0,
            actualData: 0,
            expectedData: 0,
            aboveTolerance: 0,
            belowTolerance: 0,
            belowWeight:true,
            stable_weighing_time_second: 0,
            modelWeigh: '',
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
        },
        data: {
            product: {
                product: {
                    name: '',
                    product_image:[]
                }
            },
            packing: [],
            data: 0,
            data2: 0,
            dataStore: [],
            tolerance1: 0,
            tolerance2: 0,
        }
    },
};

export default state;
