<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" class="-mb12">
                    <v-alert
                        v-if="filter.alert"
                        icon="check"
                        prominent
                        text
                        color="#03b319"
                        border="left"
                    >
                        <v-row align="center">
                            <v-col class="grow">
                                <b>Success</b><br/>
                                Item has been weighed successfully
                            </v-col>
                        </v-row>
                    </v-alert>
                    <v-alert
                        v-else
                        icon="info"
                        prominent
                        text
                        color="#08728b"
                        border="left"
                    >
                        <v-row align="center">
                            <v-col class="grow">
                                Scan product to start weight scale
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row :class="showFilter ? 'mb20' : ''">
                <v-col>
                    Setting
                    <v-btn
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
                        class="no-caps fs12"
                        data-unq="weighscale-button-hideFilter"
                    >
                        Hide
                        <v-icon right>
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-else
                        class="no-caps fs12"
                        data-unq="weighscale-button-showFilter"
                    >
                        Show
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="showFilter" :class="showFilter ? '-mb20' : ''">
                <v-col cols="12" md="4" class="mt1 -mb20">
                    <v-select
                        v-model="printSetting.modelWeigh"
                        outlined
                        label="Select Weight Scale"
                        data-unq="weighscale-filter-selectWeightScale"
                        :items="printSetting.selectWeigh"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="4" class="mt1 -mb2">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                v-model="printSetting.ipAddress"
                                name="search"
                                label="IP Address"
                                single-line
                                data-unq="weighscale-input-ipAdress"
                                class="-mt10"
                                v-on="{ ...tooltip }"
                                outlined
                                onkeypress='return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)'
                                dense
                                hint="Please Input IP Address"
                            ></v-text-field>
                        </template>
                        <span>Please insert the IP Address from your master device (the device is connected with weighscale and print)</span>
                    </v-tooltip>
                    <div v-if="filter.message == 'error2'" class="mt-1 ml-3 fs12 text-green -mb2">
                        <a 
                           v-bind:href="'https://'+ printSetting.ipAddress + ':12212/'"
                           target="_blank"
                        >
                            <span>Click here to allow certificate</span>
                        </a>
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="mt1 mb20">
                    <v-btn
                        depressed
                        data-unq="weighscale-button-setWeightScale"
                        color="#50ABA3"
                        class="no-caps bold mt3"
                        @click="setSetting(printSetting.modelWeigh, printSetting.ipAddress)"
                    >
                        <span class="text-white">
                            SET
                        </span>
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="ma12 wp100">
            <v-row>
                <v-col cols="12" md="8" class="-mt14">
                    <div class="box-col24">
                        <div class="counter-bg">
                            <div class="flex-align-center">
                                <h1 v-if="filter.scanned" class="fs200" :style="printSetting.style">
                                    <div class="d-flex align-center">
                                        {{filter.search}}
                                        <v-icon
                                            x-large
                                            dark
                                            class="fs200"
                                            :style="printSetting.style"
                                        >
                                            {{printSetting.icon}}
                                        </v-icon>
                                    </div>
                                </h1>
                                <h1 v-else class="fs200 text-white">
                                    
                                </h1>
                                <v-alert
                                    v-if="filter.caution"
                                    icon="warning"
                                    dark
                                    text
                                    color="#b9ab00"
                                    border="left"
                                >
                                    <b>PLEASE REMOVE ITEM ON THE WEIGH SCALE</b>
                                </v-alert>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="4" class="-mt14">
                    <div class="box-col24">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }">
                                <v-text-field
                                    v-model="filter.search_prd"
                                    append-icon="mdi-line-scan"
                                    name="search"
                                    label="Scan Product"
                                    single-line
                                    hide-details
                                    class="-mt10"
                                    v-on="{ ...tooltip }"
                                    outlined
                                >
                                </v-text-field>
                            </template>
                            <span>Scan Product</span>
                        </v-tooltip>
                        <div class="mt25" v-if="filter.scanned">
                            <div class="flex-align-center">
                                <div>
                                    <v-img
                                        class="rounded-form"
                                        height="180"
                                        width="250"
                                        :src="data.product.product_picture"
                                    ></v-img>
                                </div>
                                <h2 class="mt20">{{ data.product.product_name }}</h2>
                            </div>
                            <div class="mt20">
                                <DetailRowNew :name="`Product Code`" :value="`${data.product.product_id}`"/>
                                <DetailRowNew :name="`Order Qty`" :value="`${data.product.order_qty} KG`"/>
                            </div>
                            <div class="flex-align-center mt30">
                                <h1>
                                    <div v-if="filter.finished" class="align">
                                        <span class="text-green">FINISHED</span>
                                    </div>
                                </h1>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <LoadingBar :value="filter.loading"/>
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
</style>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: "CheckerWeighScale",
        data() {
            return {
                showFilter: true,
                buffer: '',
                timer: null,
            }
        },
        computed: {
            ...mapState({
                checker_weigh_scale: state => state.checkerWeighScale.checker_weigh_scale,
                filter: state => state.checkerWeighScale.checker_weigh_scale.filter,
                websocketSetting: state => state.checkerWeighScale.checker_weigh_scale.websocketSetting,
                printSetting: state => state.checkerWeighScale.checker_weigh_scale.printSetting,
                data: state => state.checkerWeighScale.checker_weigh_scale.data,
            }),
        },
        created() {
            this.weighConnection()
            this.checkBrowserTab()
            this.checkStableTime()
        },
        mounted() {
            let self = this
            let weigh = localStorage.getItem('weigh_port')
            let ip = localStorage.getItem('ip_port')
            // to get first data weigh and ip from local storage
            if (ip || weigh) {
                self.$store.commit('setPrintSetting', {...this.printSetting, ipAddress: ip, modelWeigh: weigh})
            }
            //to increment ticker and check ticker condition if its more than 5 back to zero every 1 second
            setInterval(function(){
                let ticker = self.filter.ticker += 1
                self.$store.commit('setFilterSetting', {...self.filter, ticker: ticker})
                if (self.filter.ticker > self.printSetting.stable_weighing_time_second) {
                    self.$store.commit('setFilterSetting', {...self.filter, ticker: 0})
                }
            }, 1000)
            // paralel check condition again if its more than 5 back to zero to ensure every 1 second
            setInterval(function(){
                if (self.filter.ticker > self.printSetting.stable_weighing_time_second) {
                    self.$store.commit('setFilterSetting', {...self.filter, ticker: 0})
                }
            }, 1000)
            // paralel override data2 as data from weigh scale to check the equality ever 0.1 second
            setInterval(function() {
                self.$store.commit('setData', {...self.data, data2: self.data.data})
            }, 100)
            // paralel check if data not the same as data2 it will go back to zero so it will not proceed anything yet every 0.15 second
            setInterval(function() {
                if (self.data.data !== self.data.data2) {
                    self.$store.commit('setFilterSetting', {...self.filter, ticker: 0})
                }
            }, 110);
            // paralel if its 5 second and data are the same it will proceed to do the automatic print through websocket every 1 second
            setInterval(function(){
                if (self.filter.ticker == self.printSetting.stable_weighing_time_second && (self.data.data2 === self.data.data) && parseFloat(self.data.data) > 0 && self.printSetting.belowWeight == false && self.websocketSetting.checkBrowser == true && self.filter.scanned == true) {
                    self.$store.commit('setFilterSetting', {...self.filter, ticker: 0})
                    if(!self.filter.callPrint){
                        self.$store.commit('setFilterSetting', {...self.filter, callPrint: true})
                        self.weighScale()
                    }
                }
            }, 1000)
        },
        methods: {
            ...mapActions([
                'fetchStableTime',
                'fetchProductDetail',
                'updateProduct',
            ]),
            ...mapMutations([
                'setWeighPort',
                'setIpAddress',
                'setFilterSetting',
                'setCheckStableTime',
                'setPrintSetting',
                'setWebsocketSetting',
            ]),
            // check stable time for weigh scale
            checkStableTime() {
                this.fetchStableTime({'type': 'stable_weighing_time_second'})
            },
            // checking browser tab
            checkBrowserTab() {
                let vm = this
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        vm.$store.commit('setWebsocketSetting', {...vm.websocketSetting, checkBrowser: false})
                    } else{
                        vm.$store.commit('setWebsocketSetting', {...vm.websocketSetting, checkBrowser: true})
                    }
                });
            },
            //to select Settings (Weigh and IP)
            setSetting(weigh, ip) {
                if (ip) {
                    this.$store.commit('setWeighPort', weigh)
                    this.$store.commit('setIpAddress', ip)
                    window.location.reload()
                } else {
                    this.$store.commit('setFilterSetting', {...this.filter, message: 'error2'})
                }
            },
            //connection method to websocket for weigh scale
            weighConnection() {
                let val = localStorage.getItem('weigh_port')
                let ip = localStorage.getItem('ip_port')
                this.websocket = new WebSocket(`wss://${ip}:12212/serial/`+val)
                this.websocket.onopen = this.onConnect
                this.websocket.onclose = this.onDisconnect
                this.websocket.onmessage = this.onMessage
            },
            //reconnect websocket if disconnected or idle for weigh scale
            reconnect(){
                this.weighConnection()
            },
            // to translate value from weigh scale to dom
            onMessage(evt){
                var chr = evt.data;
                var weightRegex = new RegExp('([0-9]{1,4}\\.[0-9]{1,4})kg');
                if (chr == "\n") {
                    var weightOutput = weightRegex.exec(this.buffer);
                    if (weightOutput != null) {
                        this.onUpdate(weightOutput[1]);
                    }
                    this.buffer = '';
                } else {
                    this.buffer = this.buffer + chr;
                }
            },
            //after the weigh data stable it will go to this function to update the increment and automatically print packing label
            weighScale() {
                this.updateProduct({id: this.data.product.picking_order_item_id, data: this.filter.search})
            },
            //to show and modified the translated value on input
            onUpdate(weight) {
                let that = this
                that.data.data = JSON.parse(JSON.stringify(weight))
                this.filter.search = weight.slice(2)
                if (this.filter.search >= this.data.product.order_qty && this.filter.search <= this.data.tolerance1){
                    this.printSetting.style = 'color: green;'
                    this.printSetting.icon = 'mdi-check-bold'
                    this.printSetting.belowWeight = false
                }
                else if (this.filter.search >= this.tolerance1 && this.filter.search <= this.data.tolerance2){
                    this.printSetting.style = 'color: yellow;'
                    this.printSetting.icon = 'mdi-arrow-down-bold'
                    this.printSetting.belowWeight = false
                }
                else if (this.filter.search > this.data.tolerance2){
                    this.printSetting.style = 'color: red;'
                    this.printSetting.icon = 'mdi-arrow-down-bold'
                    this.printSetting.belowWeight = true
                }
                else if (this.filter.search > 0){
                    this.printSetting.style = 'color: red;'
                    this.printSetting.icon = 'mdi-arrow-up-bold'
                    this.printSetting.belowWeight = true
                }
                else{
                    this.printSetting.style = 'color: white;'
                    this.printSetting.icon = ''
                    this.filter.callPrint = false
                    this.filter.caution = false
                    this.printSetting.belowWeight = true
                    this.filter.alert = false
                    this.filter.finished = false
                }
            },
            //show status connected if onconnect for weigh scale
            onConnect(){
                this.$store.commit('setWebsocketSetting', {...this.websocketSetting, connected: true})
                let weigh = localStorage.getItem('weigh_port')
                let ip = localStorage.getItem('ip_port')
                this.$store.commit('setPrintSetting', {...this.printSetting, ipAddress: ip, modelWeigh: weigh})
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket for weigh scale
            onDisconnect(){
                this.$store.commit('setWebsocketSetting', {...this.websocketSetting, connected: false})
                this.$store.commit('setFilterSetting', {...this.filter, message: 'error2'})
                this.reconnect()
            },
            //is websocket connected weigh scale
            isConnected(){
                return this.websocketSetting.connected
            },
        },
        watch: {
            'filter.search_prd': {
                handler: function (val) {
                    if(val !== ""){
                        let that = this
                        clearTimeout(this._timerId)
                        this._timerId = setTimeout(function(){
                            that.fetchProductDetail({id: val})
                        }, 100);
                    }
                },
                deep: true
            },
        },
    }
</script>