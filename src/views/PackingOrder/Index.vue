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
                                placeholder="Search..."
                                data-unq="packingorder.search"
                                prepend-inner-icon="search"
                                v-on="{ ...tooltip }"
                            >
                            </v-text-field>
                        </template>
                       <span>Search by Packing Order Code</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row class="hr-title"/>
            <v-row :class="showFilter?'mb24':''">
                <v-col>
                    Filter 
                    <v-btn 
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
                        data-unq="packingorder.hidefilter"
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
                        @click="showFilter = !showFilter"
                        v-else
                        data-unq="packingorder.showfilter"
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
            <v-row v-if="showFilter">
                <v-col cols="12" md="3" class="mt24">
                    <v-menu
                        ref="menu"
                        v-model="delivery_date.model"
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
                                    data-unq="packingorder.deliverydate"
                                    clearable
                                    @click:clear="delivery_date.value = [],fetchPackingOrderList()"
                                    v-model="delivery_date.input"
                                    maxlength="24"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            range
                            persistent-hint
                            v-model="delivery_date.value"
                        >
                        <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                data-unq="packingorder.deliverydate.ok"
                                @click="delivery_date.model = false,fetchPackingOrderList()"
                            >
                                OK
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="mt24">
                    <SelectWarehouse
                        :norequired="true"
                        :aux_data="2"
                        name="filter_warehouse"
                        :label="'Site'"
                        data-unq="packingorder.filter.warehouse"
                        @selected="warehouseSelected"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" md="3" class="mt24">
                    <v-select
                        v-model="filter.statuses"
                        :items="filter.status2"
                        data-unq="packingorder.filter.status"
                        name="filter_status"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <div class="box-title">
            <v-row>
                <v-col class="right">
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'PackingOrderCreate' }"
                        class="no-caps bold mr-4"
                        data-unq="packingorder.button.generatepacking"
                        v-privilege="'pc_crt'"
                    >
                        <span class="text-white">
                            Generate Packing Order
                        </span>
                    </v-btn>
                    <v-btn
                        depressed
                        color="#50ABA3"
                        :to="{ name: 'PackList' }"
                        class="no-caps bold"
                        data-unq="packingorder.button.packlist"
                        v-privilege="'pc_rdl'"
                    >
                        <span class="text-white">
                            Pack List
                        </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="box-body-table">
            <v-data-table
            :headers="table_header"
            :items="packing_order_list.data"
            :loading="packing_order_list.isLoading"
            :items-per-page="10"
        >
            <template v-slot:item="props">
                <tr style="height:48px">
                    <td>{{ props.item.code }}</td>
                    <td>{{ props.item.site.code }} - {{ props.item.site.name }}</td>
                    <td>{{ formatDate(props.item.delivery_date) }}</td>
                    <td>{{ props.item.note }}</td>
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
                                    data-unq="packingorder.button.menu"
                                    v-on="{ ...menu }"
                                ><v-icon dark>mdi-dots-vertical</v-icon></v-btn>
                            </template>
                            <v-list class="bg-white">
                                <v-list-item data-unq="packingorder.button.detail"  :to="`/site/packing-order/detail/${props.item.id}`" v-privilege="'pc_rdd'">
                                    <v-list-item-content>
                                            <v-list-item-title>Detail</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData"/>
        <!-- <LoadingBar :value="overlay"/> -->
    </v-container>
</template>
<script>
    import { mapState, mapActions } from 'vuex';
    export default {
        name: "PackingOrder",
        data() {
            return {
                overlay: false,
                showFilter: false,
                ConfirmData : {}
            }
        },
        mounted() {
            this.fetchPackingOrderList()
            let self = this
            this.$root.$on('event_success', function(res){
                if (res) {
                    self.fetchPackingOrderList()
                }
            });
        },
        computed: {
            ...mapState({
                packing_order_list: state => state.packingOrder.packing_order_list,
                table_header: state => state.packingOrder.packing_order_list.table_headers,
                filter: state => state.packingOrder.packing_order_list.filter,
                delivery_date: state => state.packingOrder.packing_order_list.filter.delivery_date,
            }),
        },
        methods: {
            ...mapActions ([
                'fetchPackingOrderList',
            ]),
            //cancel packing
            cancel(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    title : "Cancel",
                    text : "Are you sure to change this status to Cancel ?",
                    urlApi : '/site/packing_order/cancel/'+id,
                    statusMsg : "Success to change this status to Cancel",
                    data : {}
                }
            },
            //confirm packing
            confirm(id) {
                this.ConfirmData = {
                    model : true,
                    status : true,
                    title : "Confirm",
                    text : "Are you sure to change this status to Finish ?",
                    urlApi : '/site/packing_order/confirm/'+id,
                    statusMsg : "Success to change this status to Finish",
                    data : {}
                }
            },
            warehouseSelected(d) {
                this.filter.SelectWarehouse = ""
                if (d) {
                    this.filter.SelectWarehouse = d.id
                }
                this.fetchPackingOrderList()
            },
        },
        watch: {
            'filter.search': {
                handler: function (val) {
                    let that = this
                    clearTimeout(this._timerId)
                    this._timerId = setTimeout(function(){
                        that.fetchPackingOrderList()
                    }, 1000);
                },
                deep: true
            },
            'filter.statuses': {
                handler: function (val) {
                    let that = this
                    that.fetchPackingOrderList()
                },
                deep: true
            },
            'delivery_date.input': {
                handler: function (val) {
                    if (val) {
                        if (val.length == 10) {
                            let valid = this.$moment(val, 'YYYY-MM-DD', true).isValid()
                            if (valid == true) {
                                this.delivery_date.value[0] = this.$moment(val).format('YYYY-MM-DD')
                            }
                        } else if (val.length == 24) {
                            let date1 = val.substr(0,10)
                            let date2 = val.substr(14,23)
                            let valid1 = this.$moment(date1, 'YYYY-MM-DD', true).isValid()
                            let valid2 = this.$moment(date2, 'YYYY-MM-DD', true).isValid()
                            if (valid1 == true && valid2 == true) {
                                this.delivery_date.value[0] = this.$moment(date1).format('YYYY-MM-DD')
                                this.delivery_date.value[1] = this.$moment(date2).format('YYYY-MM-DD')
                            }
                        }
                    }
                },
                deep: true
            },
            'delivery_date.value': {
                handler: function (val) {
                    if (val) {
                        this.delivery_date.input = this.formatDateRange(val)
                    }
                },
                deep: true
            },
        },
    }
</script>
