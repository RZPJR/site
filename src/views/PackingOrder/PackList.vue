<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row>
                <v-col cols="12" md="4" class="h70">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                dense
                                v-model="filter.search"
                                outlined
                                filled
                                data-unq="packingorder-input-search"
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
                        @click="show_filter = !show_filter"
                        v-if="show_filter"
                        data-unq="packingorder-button-hide"
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
                        @click="show_filter = !show_filter"
                        v-else
                        data-unq="packingorder-button-show"
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
            <v-row v-if="show_filter">
                <v-col cols="12" md="3">
                    <v-menu
                        ref="menu"
                        v-model="packing_date.model"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-text-field
                                    data-unq="packingorder-filter-deliveryDate"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    maxlength="24"
                                    clearable
                                    @click:clear="packing_date.value = [],fetchPackList()"
                                    v-model="packing_date.input"
                                    dense
                                >
                                    <template v-slot:label>
                                        Packing Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            data-unq="packingorder-filter-deliveryDateOK"
                            range
                            v-model="packing_date.value"
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="packing_date.model = false,fetchPackList()"
                            >OK</v-btn>    
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        :label="'Site'"
                        name="filter_warehouse"
                        data-unq="packingorder-filter-site"
                        @selected="warehouseSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3">
                    <SelectProduct
                        :norequired="true"
                        name:="filter_product"
                        :label="'Item'"
                        data-unq="packingorder-filter-item"
                        :dense="true"
                        @selected="productSelected"
                    ></SelectProduct>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
            :headers="table_header"
            :items="pack_list.data"
            :loading="pack_list.isLoading"
            :items-per-page="10"
        >
            <template v-slot:item="props">
                <tr style="height:48px">
                    <td :data-unq="`packlist-value-pcoCode-${props.index}`">{{ props.item.packing_order.code }}</td>
                    <td :data-unq="`packlist-value-site-${props.index}`">{{ props.item.site.code }} - {{ props.item.site.name }}</td>
                    <td :data-unq="`packlist-value-code-${props.index}`">{{ props.item.code }}</td>
                    <td :data-unq="`packlist-value-item-${props.index}`">{{ props.item.item.name }} <br>
                        <span class="text-black60">
                            {{ props.item.item.code }}
                        </span>
                    </td>
                    <td :data-unq="`packlist-value-uom-${props.index}`">{{ props.item.item.uom.name }}</td>
                    <td :data-unq="`packlist-value-pack_type-${props.index}`">{{ props.item.pack_type }}</td>
                    <td :data-unq="`packlist-value-weightScale-${props.index}`">{{ props.item.weight_scale }}</td>
                    <td :data-unq="`packlist-value-deliveryDate-${props.index}`">{{ formatDate(props.item.packing_order.delivery_date) }}</td>
                    <td>
                        <div v-if="props.item.status == 1">
                            <v-chip
                                :data-unq="`packlist-value-status-active-${props.index}`"
                                :color="statusMaster('active')"
                                :text-color="statusMasterText('active')"
                            ><span class="pa-md-2">Active</span></v-chip>
                        </div>
                        <div v-else-if="props.item.status == 2">
                            <v-chip
                                :data-unq="`packlist-value-status-finished-${props.index}`"
                                :color="statusMaster('finished')"
                                :text-color="statusMasterText('finished')"
                            ><span class="pa-md-2">Finished</span></v-chip>
                        </div>
                        <div v-else-if="props.item.status == 3">
                            <v-chip
                                :data-unq="`packlist-value-status-cancelled-${props.index}`"
                                :color="statusMaster('cancelled')"
                                :text-color="statusMasterText('cancelled')"
                            ><span class="pa-md-2"> Cancelled </span></v-chip>
                        </div>
                    </td>
                    <td>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on: menu }">
                                <v-btn
                                    :data-unq="`packlist-button-menu-${props.index}`"
                                    icon
                                    v-on="{ ...menu }"
                                ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                            </template>
                            <v-list v-if="props.item.status !== 3" class="bg-white">
                                <v-list-item :data-unq="`packlist-button-reprint-${props.index}`" @click="printLabel(props.item.packing_order.id,props.item.item.id,props.item.pack_type)" v-privilege="'pc_prt'">
                                    <v-list-item-content>
                                        <v-list-item-title>Reprint</v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-icon>
                                        <v-icon>mdi-printer</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                                <hr />
                                <v-list-item :data-unq="`packlist-button-dispose-${props.index}`" @click="disposePopup(props.item.packing_order.id,props.item.item.id,props.item.pack_type,props.item.packing_order.code)" v-privilege="'pc_del'">
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
            v-model="dispose_modal"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="loading_dispose"/>
                <v-card-title>
                    <span class="text-title-modal">
                        Dispose Packing
                    </span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure to dispose <b>{{ this.packing_code }}</b> <br> <br>
                        Note: Make sure you tear the printout from code <b>{{ this.packing_code }}</b> if it has been cancelled
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="dispose_modal = false"
                        depressed
                        outlined
                        data-unq="packingorder-button-no"
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        @click="disposePacking()"
                        class="main-btn white--text"
                        depressed
                        data-unq="packingorder-button-yes"
                        color="#50ABA3"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="overlay"/>
    </v-container>
</template>
<script>
    import { mapState, mapActions, mapMutations } from "vuex";
    import Vue from 'vue'
    export default {
        name: "PackList",
        data() {
            return {
                overlay: false,
                loading_dispose: false,
                dispose_modal: false,
                show_filter: false,
                loading: false,
                packing_id: '',
                product_id: '',
                pack_type: 0,
                packing_code: '',
                websocket_print: null,
                connected_print: false,
            }
        },
        created(){
            this.printConnection()
            this.$store.commit("setWarehouseFilterList", "")
            this.$store.commit("setItemFilterList", "")
        },
        mounted() {
            this.fetchPackList()
        },
        computed: {
            ...mapState({
                pack_list: state => state.packingOrder.pack_list,
                table_header: state => state.packingOrder.pack_list.table_headers,
                filter: state => state.packingOrder.pack_list.filter,
                packing_date: state => state.packingOrder.pack_list.filter.packing_date,
            }),
        },
        methods: {
            ...mapActions ([
                'fetchPackList',
            ]),
            ...mapMutations([
                'setWarehouseFilterList',
                'setItemFilterList'
            ]),
            disposePopup(pc_id,prd_id,pack,code){
                this.packing_id = pc_id
                this.product_id = prd_id
                this.pack_type = pack
                this.packing_code = code
                this.dispose_modal = true
            },
            //to dispose printed packing if error occured in the warehouse
            disposePacking(){
                this.loading_dispose = true
                this.$http.delete("/site/v1/packing_order/pack/dispose/"+this.packing_id,{
                    data:{
                        item_id: this.product_id,
                        pack_type: this.pack_type,
                    }
                })
                .then(response => {
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Success to dispose',
                        type: 'success',
                    });
                    this.fetchPackList()
                    this.loading_dispose = false
                    this.dispose_modal = false
                })
            },
            //connection method to websocket for print
            printConnection(){
                this.websocket_print = new WebSocket("ws://127.0.0.1:12212/printer")
                this.websocket_print.onopen = this.onConnectPrint
                this.websocket_print.onclose = this.onDisconnectPrint
            },
            //reconnect websocket if disconnected or idle for print 
            reconnectPrint(){
                this.printConnection()
            },
            //submit data after weight scale to printer
            submitDataToWebSocket(data){
                if (Array.isArray(data)) {
                    data.forEach(function (element) {
                        this.websocket_print.send(JSON.stringify(element));
                    });
                } else {
                    this.websocket_print.send(JSON.stringify(data));
                }
            },
            //show status connected if onconnect for print
            onConnectPrint(){
                this.connected_print = true
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket for print
            onDisconnectPrint(){
                this.connected_print = false
                this.reconnectPrint()
            },
            //is websocket connected print
            isconnected_print(){
                return this.connected_print
            },
            //to print label to through the websocket
            printLabel(pc_id,prd_id,pack){
                this.overlay = true
                this.$http.put("/site/v1/packing_order/pack/print/"+pc_id,{
                    item_id: prd_id,
                    pack_type: pack,
                    type_print: 2,
                    weight_scale: 0
                })
                .then(response => {
                    if(this.isconnected_print()){
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
                this.$store.commit("setWarehouseFilterList", "")
                if (d) {
                    this.$store.commit("setWarehouseFilterList", d.id)
                }
                this.fetchPackList()
            },
            //select warehouse by id
            productSelected(d) {
                this.$store.commit("setItemFilterList", "")
                if (d) {
                    this.$store.commit("setItemFilterList", d.id)
                }
                this.fetchPackList()
            },
        },
        watch: {
            'filter.search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.fetchPackList()
                    }, 1000);
                },
                deep: true
            },
            // For filter by date input format
            'packing_date.input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.packing_date.value[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0, 10)
                            let date2 = val.substr(14, 23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.packing_date.value[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.packing_date.value[1] = this.$moment(date2).format('YYYY-MM-DD')
                                if (this.packing_date.value.length == 2) {
                                    this.fetchNotification()
                                }
                            }
                        }
                    }
                },
                deep: true
            },
            // For filter by date input value
            'packing_date.value': {
                handler: function (val) {
                    if (val) {
                        this.packing_date.input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
