<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="-mt24">
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
                                    name="departure_date"
                                    prepend-inner-icon="mdi-calendar"
                                    outlined
                                    clearable
                                    maxlength="10"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 45"
                                    @click:clear="form.delivery_date = '',getProduct()"
                                    :error-messages="error.delivery_date"
                                    v-model="form.delivery_date"
                                    dense
                                >
                                    <template v-slot:label>
                                        Delivery Date<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </div>
                        </template>
                        <v-date-picker
                            v-model="form.delivery_date"
                            @input="delivery_date_model = false,getProduct()"
                        ></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectArea
                        name="area"
                        @selected="areaSelected"
                        :aux_data="2"
                        :area="area"
                        :error="error.area_id"
                        :dense="true"
                    ></SelectArea>
                </v-col>
                <v-col cols="12" md="6" class="-mt24">
                    <SelectWarehouse
                        name="warehouse"
                        :aux_data="2"
                        :area_id="form.area_id"
                        :warehouse="warehouse"
                        :disabled="warehouseDis"
                        @selected="warehouseSelected"
                        :error="error.warehouse_id"
                        :dense="true"
                    ></SelectWarehouse>
                </v-col>
                <v-col cols="12" class="-mt24">
                    <v-textarea
                        name="note"
                        v-model="form.note"
                        :counter="350"
                        outlined
                        :error-messages="error.note"
                        required
                        dense
                    >
                        <template v-slot:label>
                            Note
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box">
            <v-row>
                <v-col>
                    <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="$router.go(-1)"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                        v-privilege="'pc_rdl'"
                    >
                    <span class="text-black80">Cancel</span>
                    </v-btn>
                    <v-btn
                        @click="confirmButton()"
                        depressed
                        color="#50ABA3"
                        class="main-btn white--text"
                        v-privilege="'pco_crt'"
                    >Save</v-btn>
                </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialog :sendData="ConfirmData"/>
    </v-container>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: 'CreateGoodsTransfer',
        data () {
            return {
                form : {
                    delivery_date:new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                    warehouse_id:"",
                    note:"",
                },
                table: {
                    fields: [
                        {
                            text:'Product Name',
                            class: 'grey--text text--darken-4',
                            sortable: false,
                        },
                        {
                            text:'UOM',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Sales Order Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Available Qty',
                            class: 'grey--text text--darken-4',
                            sortable: false
                        },
                        {
                            text:'Packer',
                            class: 'grey--text text--darken-4',
                            width: "40%",
                            sortable: false
                        },
                    ],
                },
                error : {},
                success : {},
                ConfirmData : {},
                area : '',
                warehouse : '',
                warehouseDis : true,
                delivery_date_model : '',
                productIdx : ''
            }
        },
        mounted () {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },
        methods:{
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Create Packing Order",
                    text : "Are you sure want to generate this packing order?",
                    urlApi : "/warehouse/packing_order/recommendation/generate",
                    nextPage : "/warehouse/packing-order",
                    data : this.form,
                    post : true
                }
            },
            areaSelected(d) {
                this.form.area_id = ""
                this.warehouse = ""
                this.area = ""
                this.form.warehouse_id = ""
                this.warehouseDis = true
                if (d) {
                    this.area = d
                    this.form.area_id = d.id
                    this.warehouseDis = false
                }
            },
            warehouseSelected(d) {
                this.form.warehouse_id = ""
                this.warehouse = ""
                if (d) {
                    this.warehouse = d
                    this.form.warehouse_id = d.id
                }
            },
        }
    }
</script>
