<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-col cols="6" offset="3">
                <v-card-text style="padding-top:20%;">
                    <div class="header-text">
                        <div>
                            <span class="fs30 bold">Scan QR Code<br></span>
                            <span class="fs20">(Sales Order Code)</span>
                        </div>
                        <div class="mt30">
                            <span class="fs16 text-black60">Printer Status :</span>
                        </div>
                        <div class="mb20">
                            <span v-if="print_label.websocket_setting.websocket_status == ''" class="waiting-connection">
                                Waiting for connection...
                            </span>
                            <span v-if="print_label.websocket_setting.websocket_status == 'Connected'" class="connected-connection">
                                {{print_label.websocket_setting.websocket_status}}
                            </span>
                            <span v-if="print_label.websocket_setting.websocket_status == 'Disconnected'" class="disconnected-connection">
                                {{print_label.websocket_setting.websocket_status}}
                            </span>
                        </div>
                    </div>
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-text-field
                                    ref="searchSO"
                                    v-model="print_label.search"
                                    append-icon="mdi-line-scan"
                                    name="search"
                                    single-line
                                    hide-details
                                    class="-mt10"
                                    v-on="{ ...tooltip }"
                                    outlined
                                >
                                    <template v-slot:label>
                                        <div v-if="print_label.filter_type.value == 'label_picking' || print_label.filter_type == 'label_picking'">
                                            <span>SO Code</span>
                                        </div>
                                        <div v-else-if="print_label.filter_type.value == 'label_rfid' || print_label.filter_type == 'label_rfid'">
                                            <span>Product Box RFID</span>
                                        </div>
                                        <div v-else>
                                            <span>SO Code</span>
                                        </div>
                                    </template>
                                </v-text-field>
                            </template>
                            <span>Scan QR Code</span>
                        </v-tooltip>
                        <div class="text-red ml20 pt5" v-if="print_label.errorSO">
                            <span>
                                SO QR Code is invalid, please re-check.
                            </span>
                        </div>
                    </div>
                    <v-select
                        style="margin-top:30px;"
                        v-model="print_label.filter_type"
                        outlined
                        label="Print Type"
                        :items="print_label.item_filter"
                        @change="selectedFilterType(print_label.filter_type)"
                    ></v-select>
                </v-card-text>
            </v-col>
        </div>
        <LoadingBar :value="print_label.loading"/>
    </v-container>
</template>
<style scoped>
.fs200{
    font-size: 12vw !important;
}
.counter-bg{
    background-color:#2B3739 !important; 
    padding:20px;
}
.text-yellow{
    color: yellow;
}
.text-red{
    color: red;
}
.text-green{
    color: green;
}
.text-white{
    color:white;
}
.black-ic{
    color: black !important;
}
.align{
    text-align: center;
}
.bg-white-btn{
    background-color: white !important;
}
.box-start{
    height: 95%;
}
.header-text{
    margin:auto;
    width:100%;
    padding-bottom:20px;
    text-align:center;
}
.waiting-connection{
    color:#2A89A7;
    font-size: 16px;
}
.connected-connection{
    color:#2EA919;
    font-size: 16px;
}
.disconnected-connection{
    color:#FF2D2D;
    font-size: 16px;
}
</style>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: "PrintLabelPicking",
        data() {
            return {
                showFilter: true,
                buffer: '',
                timer: null,
            }
        },
        computed: {
            ...mapState({
                print_label: state => state.printLabel.print_label,
            }),
            printDs() {
                console.log('ini print ds')
            }
        },
        created() {
            this.getWebSocketPrintLabel()
        },
        mounted() {
            this.setPrintTypeVal()
            this.$nextTick(() => this.$refs.searchSO.focus())
        },
        methods: {
            ...mapActions([
                'getWebSocketPrintLabel',
                'printLabel'
            ]),
            selectedFilterType(filter_type){ // set value to filter_type
                localStorage.setItem('filter_type',filter_type)
            },
            setPrintTypeVal(){ // set value of print type from local storage
                this.print_label.filter_type = {
                    value: localStorage.getItem('filter_type')
                }
            },
            getIncrementKoli() { // get increment koli
                console.log('increment koli')
            }
        },
        watch: {
            'print_label.search': {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.printLabel({val})
                        }, 100);
                    }
                },
                deep: true
            },
            'print_label.search_rpt': {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.getIncrementKoli(val)
                        }, 100);
                    }else{
                        this.print_label.koliDs = true
                        this.print_label.form_prt.increment_prints = []
                    }
                },
                deep: true
            },
        },
    }
</script>