const state = {
    print_label: {
        url: '',
        koliDs: true,
        loading: false,
        errorSO: false,
        errorSORpt: false,
        filePdf: '',
        search: '',
        search_rpt: '',
        so_code: '',
        merchant_name: '',
        helper_code: '',
        total_koli: '',
        websocket_setting: {
            websocket: null,
            websocket_status: '',
            connected: false,
        },
        form_prt:{
            sales_order_code: '',
            increment_prints: [],
        },
        item_koli: [],
        item_filter: [
            {
                text: 'Label',
                value: 'label_picking'
            },
            {
                text: 'Surat Jalan',
                value: 'sj'
            },
        ],
        filter_type:  {
            text: 'Label',
            value: 'label_picking'
        },
        filter_type_rpt:  {
            text: 'Label',
            value: 'label_picking'
        },
    }
};

export default state;