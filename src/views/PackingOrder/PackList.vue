<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }" v-privilege="'filter_rdl'">
                            <v-text-field
                                dense
                                v-model="search"
                                outlined
                                filled
                                placeholder="Search..."
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by Packing Order Code, Pack List Code, and Product Name</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="filter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon
                            right
                        >
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn 
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon
                            right
                        >
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row :class="filter? '':'hidden'">
                <v-col cols="12" md="3" class="-mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date_model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    name="filter_delivery_date"
                                    clearable
                                    @click:clear="delivery_date = [],renderData(search)"
                                    v-model="delivery_date_input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Packing Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="delivery_date"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="delivery_date_model = false,renderData(search)"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="filter_warehouse"
                        @selected="warehouseSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="-mt24">
                    <SelectProduct
                        :norequired="true"
                        name:="filter_product"
                        :dense="true"
                        @selected="productSelected"
                    ></SelectProduct>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
            :headers="table.fields"
            :items="items"
            :loading="loading"
            :items-per-page="10"
        >
            <template v-slot:item="props">
                <tr style="height:48px">
                    <td>{{ props.item.packing_order.code }}</td>
                    <td>{{ props.item.packing_order.warehouse.code }} - {{ props.item.packing_order.warehouse.name }}</td>
                    <td>{{ props.item.code }}</td>
                    <td>{{ props.item.product.name }} <br>
                        <span class="text-black60">
                            {{ props.item.product.code }}
                        </span>
                    </td>
                    <td>{{ props.item.product.uom.name }}</td>
                    <td>{{ props.item.pack_type }}</td>
                    <td>{{ props.item.weight_scale }}</td>
                    <td>{{ formatDate(props.item.packing_order.delivery_date) }}</td>
                    <td>
                        <div v-if="props.item.status == 1">
                            <v-chip
                                :color="statusMaster('active')"
                                :text-color="statusMasterText('active')"
                            ><span class="pa-md-2">Active</span></v-chip>
                        </div>
                        <div v-else-if="props.item.status == 2">
                            <v-chip
                                :color="statusMaster('finished')"
                                :text-color="statusMasterText('finished')"
                            ><span class="pa-md-2">Finished</span></v-chip>
                        </div>
                        <div v-else-if="props.item.status == 3">
                            <v-chip
                                :color="statusMaster('cancelled')"
                                :text-color="statusMasterText('cancelled')"
                            ><span class="pa-md-2"> Cancelled </span></v-chip>
                        </div>
                    </td>
                    <td>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on: menu }">
                                <v-btn
                                    icon
                                    v-on="{ ...menu }"
                                ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                            </template>
                            <v-list v-if="props.item.status !== 3" class="bg-white">
                                <v-list-item  @click="printLabel(props.item.packing_order.id,props.item.product.id,props.item.pack_type)" v-privilege="'pc_prt'">
                                    <v-list-item-content>
                                        <v-list-item-title>Reprint</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon>mdi-printer</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                                <hr />
                                <v-list-item @click="disposePopup(props.item.packing_order.id,props.item.product.id,props.item.pack_type,props.item.packing_order.code)" v-privilege="'pc_del'">
                                    <v-list-item-content>
                                        <v-list-item-title>Dispose</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon>mdi-delete</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
        <v-dialog
            v-model="disposeModal"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="loadingDispose"/>
                <v-card-title>
                    <span class="text-title-modal">
                        Dispose Packing
                    </span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure to dispose <b>{{ this.PackingCode }}</b> <br> <br>
                        Note: Make sure you tear the printout from code <b>{{ this.PackingCode }}</b> if it has been cancelled
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="disposeModal = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="disposePacking()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: "PackList",
        data() {
            return {
                overlay: false,
                loadingDispose: false,
                disposeModal: false,
                search: '',
                filter: false,
                delivery_date_input : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                delivery_date_model : '',
                delivery_date : [new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10)],
                loading: false,
                table: {
                    fields: [
                        {
                            text:'Packing Order Code',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'Warehouse',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Pack Code',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Product',
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
                },
                items:[],
                SelectWarehouse : '',
                SelectProduct: '',
                overlay: false,
                PackingId: '',
                ProductId: '',
                PackType: 0,
                PackingCode: '',
                websocketPrint: null,
                connectedPrint: false,
            }
        },
        created(){
            this.printConnection()
        },
        mounted() {
            this.renderData('')
        },
        methods: {
            //render data to table
            renderData(search){
                let warehouse = ''
                if (this.SelectWarehouse) {
                    warehouse = this.SelectWarehouse
                }
                let product = ''
                if (this.SelectProduct) {
                    product = this.SelectProduct
                }
                let delivery_date = ''
                if (this.delivery_date.length > 0) {
                    if (this.delivery_date.length == 1) {
                        delivery_date = this.delivery_date[0]+'|'+this.delivery_date[0]
                    } else {
                        let date = this.delivery_date[0]
                        let date2 = this.delivery_date[1]
                        if (date > date2) {
                            delivery_date = date2+'|'+date
                        } else {
                            delivery_date = date+'|'+date2
                        }
                    }
                }
                this.loading = true;
                this.items = []
                this.$http.get("/warehouse/packing_order/recommendation/pack",{params:{
                        perpage:10,
                        warehouse: warehouse,
                        product: product,
                        packing_date: delivery_date,
                        queryString: search,
                        orderby:'-id',
                    }}).then(response => {
                    this.loading = false
                    this.items = response.data.data
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            disposePopup(pc_id,prd_id,pack,code){
                this.PackingId = pc_id
                this.ProductId = prd_id
                this.PackType = pack
                this.PackingCode = code
                this.disposeModal = true
            },
            //to dispose printed packing if error occured in the warehouse
            disposePacking(){
                this.loadingDispose = true
                this.$http.put("/warehouse/packing_order/recommendation/dispose/"+this.PackingId,{
                    product_id: this.ProductId,
                    pack_type: this.PackType,
                })
                .then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Success to dispose',
                        type: 'success',
                    });
                    this.renderData(this.search)
                    this.loadingDispose = false
                    this.disposeModal = false
                })
            },
            //connection method to websocket for print
            printConnection(){
                this.websocketPrint = new WebSocket("ws://127.0.0.1:12212/printer")
                this.websocketPrint.onopen = this.onConnectPrint
                this.websocketPrint.onclose = this.onDisconnectPrint
            },
            //reconnect websocket if disconnected or idle for print 
            reconnectPrint(){
                this.printConnection()
            },
            //submit data after weight scale to printer
            submitDataToWebSocket(data){
                if (Array.isArray(data)) {
                    data.forEach(function (element) {
                        this.websocketPrint.send(JSON.stringify(element));
                    });
                } else {
                    this.websocketPrint.send(JSON.stringify(data));
                }
            },
            //show status connected if onconnect for print
            onConnectPrint(){
                this.connectedPrint = true
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket for print
            onDisconnectPrint(){
                this.connectedPrint = false
                this.reconnectPrint()
            },
            //is websocket connected print
            isConnectedPrint(){
                return this.connectedPrint
            },
            //to print label to through the websocket
            printLabel(pc_id,prd_id,pack){
                this.overlay = true
                this.$http.put("/warehouse/packing_order/recommendation/print/"+pc_id,{
                    product_id: prd_id,
                    pack_type: pack,
                    type_print: 0,
                    weight_scale: 0
                })
                .then(response => {
                    if(this.isConnectedPrint()){
                        this.submitDataToWebSocket({
                            'type': 'LABEL',
                            'url': response.data.data.link_print
                        })
                    }else{
                        alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                        window.open(response.data.data.link_print, '_blank');
                    }
                    this.overlay = false
                })
            },
            //select warehouse by d
            warehouseSelected(d) {
                this.SelectWarehouse = ""
                if (d) {
                    this.SelectWarehouse = d.id
                }
                this.renderData(this.search)
            },
            //select warehouse by id
            productSelected(d) {
                this.SelectProduct = ""
                if (d) {
                    this.SelectProduct = d.id
                }
                this.renderData(this.search)
            },
        },
        watch: {
            'search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.renderData(val, that.statuses)
                    }, 1000);
                },
                deep: true
            },
            'delivery_date_input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date[0] = this.$moment(val).format('YYYY-MM-DD')
                                this.renderData(this.search)
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                let date3 = new Date(this.delivery_date[0])
                                let date4 = new Date(this.delivery_date[1])
                                if (parseInt((date4-date3)/(24*3600*1000)) > 6 || parseInt((date4-date3)/(24*3600*1000)) < -6) {
                                    if (date4 < date3) {
                                        this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.delivery_date.splice(1,1)
                                    } else {
                                        this.delivery_date[0] = this.$moment(date3).format('YYYY-MM-DD')
                                        this.delivery_date.splice(1,1)
                                    }
                                    this.renderData(this.search)
                                } 
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date': {
                handler: function (val) {
                    if (val) {
                        this.delivery_date_input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
