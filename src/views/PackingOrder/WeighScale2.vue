<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" class="-mb12">
                    <v-alert
                        v-if="weigh_scale.alert"
                        icon="check"
                        prominent
                        text
                        color="#03b319"
                        border="left"
                        >
                        <v-row align="center">
                            <v-col class="grow">
                                <b>Success</b><br/>
                                Last Packing <b>{{ weigh_scale.packing_code }}</b> has been printed
                            </v-col>
                            <v-col v-if="weigh_scale.actualData !== weigh_scale.expectedData" class="shrink">
                                <v-btn
                                    @click="toDetail()"
                                    depressed
                                    data-unq="weighscale-button-back"
                                    outlined
                                    color="#EBEBEB"
                                    class="main-btn bg-white-btn"
                                    dark
                                >
                                    <v-icon
                                        dark
                                        left
                                        class="black-ic"
                                    >
                                        mdi-arrow-left-bold
                                    </v-icon><span class="text-black80">Back</span> 
                                </v-btn>
                            </v-col>
                            <v-col class="shrink">
                                <v-btn
                                    depressed
                                    color="#50ABA3"
                                    class="no-caps bold"
                                    data-unq="weighscale-button-reprint"
                                    @click="packingLabelPrint()"
                                >
                                <span class="text-white">
                                    Reprint
                                </span>
                                </v-btn>
                            </v-col>
                            <v-col class="shrink">
                                <v-btn
                                    class="no-caps bold"
                                    color="red"
                                    dark
                                    data-unq="weighscale-button-dispose"
                                    @click="weigh_scale.dispose = true"
                                >
                                    <span class="text-white">
                                        Dispose
                                    </span>
                                    <v-icon
                                        dark
                                        right
                                    >
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
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
                                Put the item on the Weigh Scale machine to get started
                            </v-col>
                            <v-col v-if="weigh_scale.actualData !== weigh_scale.expectedData" class="shrink">
                                <v-btn
                                    @click="toDetail()"
                                    depressed
                                    outlined
                                    data-unq="weighscale-button-backDetail"
                                    color="#EBEBEB"
                                    class="main-btn bg-white-btn"
                                    dark
                                >
                                    <v-icon
                                        dark
                                        left
                                        class="black-ic"
                                    >
                                        mdi-arrow-left-bold
                                    </v-icon><span class="text-black80">Back</span> 
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row :class="filter ? 'mb20' : ''">
                <v-col>
                    Setting
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-if="filter"
                        data-unq="weighscale-button-hideFilter"
                        class="no-caps fs12"
                    >
                        Hide
                        <v-icon right>
                            mdi-chevron-up
                        </v-icon>
                    </v-btn>
                    <v-btn
                        depressed
                        x-small
                        @click="filter = !filter"
                        v-else
                        data-unq="weighscale-button-showFilter"
                        class="no-caps fs12"
                    >
                        Show
                        <v-icon right>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-if="filter">
                <v-col cols="12" md="3" class="mt15">
                    <v-select
                        v-model="weigh_scale.modelWeigh"
                        outlined
                        label="Select Weigh Scale"
                        data-unq="weighscale-filter-selectWeightScale"
                        :items="weigh_scale.selectWeigh"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt15 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                required
                                v-model="weigh_scale.portIp"
                                name="search"
                                label="IP Address"
                                single-line
                                data-unq="weighscale-input-ipAdress"
                                hide-details
                                v-on="{ ...tooltip }"
                                outlined
                                onkeypress='return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)'
                                dense
                                :error="weigh_scale.message == 'error1'"
                            ></v-text-field>
                        </template>
                        <span>Please insert the IP Address from your master device (the device is connected with weighscale and print)</span>
                    </v-tooltip>
                    <div v-if="weigh_scale == 'error1'" class="mt-1 ml-3 fs12 text-red -mb2">
                        <span>Please Input IP Address</span>
                    </div>
                    <div v-if="weigh_scale == 'error2'" class="mt-1 ml-3 fs12 text-green -mb2">
                        <a 
                           v-bind:href="'https://'+ portIp + ':12212/'"
                           target="_blank"
                        >
                            <span>Click here to allow certificate</span>
                        </a>
                    </div>
                </v-col>
                <v-col cols="12" md="3" class="mt15">
                    <v-select
                        v-model="weigh_scale.modelTime"
                        outlined
                        data-unq="weighscale-select-printingTime"
                        label="Select Printing Time"
                        :items="weigh_scale.selectTime"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt10 mb20">
                    <v-btn
                        depressed
                        data-unq="weighscale-button-setWeightScale"
                        color="#50ABA3"
                        class="no-caps bold mt8"
                        @click="setSetting(weigh_scale.modelWeigh, weigh_scale.portIp, weigh_scale.modelTime)"
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
                                <h1 class="fs200" :style="weigh_scale.style">
                                    <div class="d-flex align-center">
                                        {{weigh_scale.search}}
                                        <v-icon
                                            x-large
                                            dark
                                            class="fs200"
                                            :style="weigh_scale.style"
                                        >
                                            {{weigh_scale.icon}}
                                        </v-icon>
                                    </div>
                                </h1>
                                <v-alert
                                    v-if="weigh_scale.caution"
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
                        <div v-if="weigh_scale.manual">
                            <v-btn
                                block
                                depressed
                                color="#50ABA3"
                                class="no-caps bold -mt5 mb20"
                                data-unq="weighscale-button-printWeightScale"
                                @click="fetchWeighScale(weigh_scale.dataStore)"
                            >
                                <span class="text-white">
                                    PRINT
                                </span>
                            </v-btn>
                        </div>
                        <div class="flex-align-center">
                                <v-img
                                    class="rounded-form"
                                    height="150"
                                    width="200"
                                    :src="weigh_scale.product.item.item_image.image_url"
                                ></v-img>
                            <h2 class="mt16">{{ weigh_scale.product.item.name }}</h2>
                        </div>
                        <div class="mt16">
                            <DetailRowNew :name="`Pack`" :value="`${weigh_scale.product.pack_type} KG`"/>
                        </div>
                        <div class="flex-align-center mt25">
                            <h1>
                                {{ weigh_scale.actualData }}/{{ weigh_scale.expectedData }} Pack <br>
                                <div v-if="weigh_scale.finished" class="align">
                                    <span class="text-green">FINISHED</span> <br>
                                    <v-btn
                                        @click="toDetail()"
                                        depressed
                                        outlined
                                        color="#EBEBEB"
                                        class="main-btn"
                                        dark
                                    >
                                        <v-icon
                                            dark
                                            left
                                            data-unq="weighscale-button-backDetail"
                                            class="black-ic"
                                        >
                                            mdi-arrow-left-bold
                                        </v-icon><span class="text-black80">Back</span> 
                                    </v-btn>
                                </div>
                            </h1>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
         <v-dialog
            v-model="weigh_scale.dispose"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="weigh_scale.loadingDispose"/>
                <v-card-title>
                    <span class="text-title-modal">
                        Dispose Packing
                    </span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure to dispose <b>{{ weigh_scale.packing_code }}</b> <br> <br>
                        Note: Make sure you tear the printout from code <b>{{ weigh_scale.packing_code }}</b> if it has been cancelled
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="weigh_scale.dispose = false"
                        depressed
                        outlined
                        color="#EBEBEB"
                        data-unq="weighscale-button-cancelDispose"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        data-unq="weighscale-button-dispose"
                        @click="fetchDisposePacking(weigh_scale.dataStore)"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="weigh_scale.fulfill"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">
                        Oops!
                    </span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        You have finished the packing for "<b>{{ weigh_scale.product.item.name }} (x{{ weigh_scale.product.pack_type }})</b>". Let's weigh the next item.
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="weigh_scale.fulfill = false"
                        class="main-btn white--text"
                        depressed
                        data-unq="weighscale-button-closeFulfill"
                        color="#50ABA3"
                    >Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="weigh_scale.loading"/>
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
    import Vue from 'vue'
    export default {
        name: "WeighScale",
        data() {
            return {
                filter: true,
            }
        },
        computed: {
            ...mapState({
                weigh_scale: state => state.packingOrder.weigh_scale
            })
        },
        created() {
            //initiate connection to websocket
            this.getWebSocketWeighScale({
                callback: this.onMessage
            })
            this.printConnection()
            this.checkBrowserTab()
            this.checkStableTime()

        },
        mounted() {
            let self = this
            self.$store.commit('setWeighScaleData', {
                ...self.weigh_scale,
                dataStore: JSON.parse(localStorage.getItem("valueWeight"))
            })
            self.fetchRenderProduct({data: self.weigh_scale.dataStore})
            let weigh = localStorage.getItem('weigh_port')
            let time = localStorage.getItem('time')
            let ip = localStorage.getItem('ip_port')
            // get default IP
            if (ip || weigh || time) {
                self.$store.commit('setWeighScaleData', {
                    ...this.weigh_scale,
                    modelWeigh: weigh,
                    portIp: ip,
                    modelTime: time
                })
            }
            //to increment ticker and check ticker condition if its more than 5 back to zero every 1 second
            setInterval(function(){
                let ticker = self.weigh_scale.ticker += 1
                self.$store.commit('setWeighScaleData', {
                    ...self.weigh_scale,
                    ticker: ticker
                })
                   if (self.weigh_scale > self.weigh_scale.stable_weighing_time_second) {
                    self.$store.commit('setWeighScaleData', {
                        ...self.weigh_scale,
                        ticker: 0
                    })
                }
            }, 1000)
            // paralel check condition again if its more than 5 back to zero to ensure every 1 second
            setInterval(function(){
                if (self.weigh_scale.ticker > self.weigh_scale.stable_weighing_time_second) {
                    self.ticker = 0
                }
            }, 1000)
            // paralel override data2 as data from weigh scale to check the equality ever 0.1 second
            setInterval(function() {
                self.$store.commit('setWeighScaleData', {
                    ...self.weigh_scale,
                    data2: self.weigh_scale.data
                })
            }, 100)
            // paralel check if data not the same as data2 it will go back to zero so it will not proceed anything yet every 0.15 second
            setInterval(function() {
                if (self.weigh_scale.data !== self.weigh_scale.data2) {
                    self.$store.commit('setWeighScaleData', {
                        ...self.weigh_scale,
                        ticker: 0
                    })
                }
            }, 110);
            // paralel data are the same it will proceed to do the print automatic or manual base on conditions
            setInterval(function(){
                if (time) {
                    if (self.weigh_scale.ticker == self.weigh_scale.stable_weighing_time_second && (self.weigh_scale.data2 === self.weigh_scale.data) && parseFloat(self.weigh_scale.data) > 0 && self.weigh_scale.belowWeight == false && self.weigh_scale.checkBrowser == true && time != 0) {
                        // for automatic print 5 seconds
                        self.$store.commit('setWeighScaleData', {
                            ...self.weigh_scale,
                            ticker: 0
                        })
                        if(!self.weigh_scale.callPrint){
                            self.$store.commit('setWeighScaleData', {
                                ...self.weigh_scale,
                                callPrint: true
                            })
                            self.weighScale()
                        }
                    } else if (self.weigh_scale.ticker == self.weigh_scale.stable_weighing_time_second && (self.weigh_scale.data2 === self.weigh_scale.data) && parseFloat(self.weigh_scale.data) > 0 && self.weigh_scale.belowWeight == false && self.weigh_scale.checkBrowser == true && time == 0) {
                        // for manual print
                        self.weigh_scale.ticker = 0
                        if(!self.weigh_scale.callPrint){
                            self.$store.commit('setWeighScaleData', {
                                ...self.weigh_scale,
                                callPrint: true,
                                manual: true
                            })
                        }
                    }
                }
            }, time)
        },
        methods: {
            ...mapActions([
                'getWebSocketWeighScale',
                'fetchStableTime',
                'fetchRenderProduct',
                'packingLabelPrint',
                'fetchWeighScale',
                'fetchDisposePacking'
            ]),
            ...mapMutations([
                'setWeighScaleData'
            ]),
            // to check weigh scale stable time before do action
            checkStableTime(){
                this.fetchStableTime({'type' : 'stable_weighing_time_second'})
            },
            //check browser tab if active or not
            checkBrowserTab(){
                let vm = this
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        vm.$store.commit('setWeighScaleData', {
                            ...vm.weigh_scale,
                            checkBrowser: false
                        })
                    }else{
                        vm.$store.commit('setWeighScaleData', {
                            ...vm.weigh_scale,
                            checkBrowser: true
                        })
                    }
                });
            },
            //route to detail
            toDetail(){
                window.location.replace('/site/packing-order/detail/'+this.dataStore.packing_id);
            },
            //to select Settings (Weigh, IP, Time)
            setSetting(weigh, ip, time) {
                if (weigh && ip && time) {
                    localStorage.setItem('weigh_port',weigh)
                    localStorage.setItem('ip_port', ip)
                    localStorage.setItem('time',time)
                    window.location.reload()
                } else {
                    this.$store.commit('setWeighScaleData', {
                        ...this.weigh_scale,
                        message: 'error1'
                    })
                }
            },
            //connection method to websocket for print
            printConnection(){
                let ip = localStorage.getItem('ip_port')
                this.websocketPrint = new WebSocket(`wss://${ip}:12212/printer`)
                this.websocketPrint.onopen = this.onConnectPrint
                this.websocketPrint.onclose = this.onDisconnectPrint
            },
            //reconnect websocket if disconnected or idle for print 
            reconnectPrint(){
                this.printConnection()
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
            //to dispose printed packing if error occured in the warehouse
            disposePacking(){
                this.loadingDispose = true
                this.$http.delete("/site/v1/packing_order/pack/dispose/"+this.dataStore.packing_id,{
                    data: {
                        item_id: this.dataStore.product_id,
                        pack_type: this.dataStore.pack_type,
                    }
                })
                .then(response => {
                    this.packing_code = response.data.data.code_print
                    this.alert = false
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Success to dispose ' + this.packing_code,
                        type: 'success',
                    });
                    this.actualData = response.data.data.actual_total_pack
                    this.expectedData = response.data.data.expected_total_pack
                    if(this.actualData !== this.expectedData){
                        this.finished = false
                    }
                    this.loadingDispose = false
                    this.dispose = false
                })
            },
            //after the weigh data stable it will go to this function to update the increment and automatically print packing label
            weighScale(){
                //  || this.product.actual_total_pack > this.product.expected_total_pack
                this.loading = true
                this.$http.put("/site/v1/packing_order/pack/update/"+this.dataStore.packing_id,{
                    item_id: this.dataStore.product_id,
                    pack_type: this.dataStore.pack_type,
                    type_print: 1,
                })
                .then(response => {
                    if(this.product.actual_total_pack >= this.product.expected_total_pack){
                        this.fulfill = true
                    }else{
                        this.$http.put("/site/v1/packing_order/pack/print/"+this.dataStore.packing_id,{
                            item_id: this.dataStore.product_id,
                            pack_type: this.dataStore.pack_type,
                            type_print: 1,
                            weight_scale: parseFloat(this.search)
                        })
                        .then(res => {
                            if(this.isConnectedPrint()){
                                this.submitDataToWebSocket({
                                    'type': 'LABEL',
                                    'url': res.data.data.link_print
                                })
                            }else{
                                alert('Automatic print is disconnected. Please try to reconnect the whb.exe or contact admin, press OK to manually print the Label');
                                window.open(res.data.data.link_print, '_blank');
                            }
                            this.packing_code = res.data.data.code
                            if(this.packing_code === ''){
                                this.packing_code == ''  
                            }
                            this.actualData = res.data.data.actual_total_pack
                            this.expectedData = res.data.data.expected_total_pack
                            this.loading = false
                            this.alert = true
                            this.caution = true
                            this.manual = false
                            if(this.actualData === this.expectedData){
                                this.finished = true
                            }
                        })
                    }
                }).catch(e => {
                    this.loading = false
                    this.fulfill = true
                })
            },
            //to print label to through the websocket
            printLabel(){
                this.loading = true
                this.$http.put("/site/v1/packing_order/pack/print/"+this.dataStore.packing_id,{
                    item_id: this.dataStore.product_id,
                    pack_type: this.dataStore.pack_type,
                    type_print: 2,
                    weight_scale: parseFloat(this.search)
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
                    this.loading = false
                })
            },
            //to show and modified the translated value on input
            onUpdate(weight) {
                let that = this
                that.weigh_scale.data = JSON.parse(JSON.stringify(weight))
                this.weigh_scale.search = weight.slice(2)
                if (this.weigh_scale.search == this.weigh_scale.tolerance) { // weight equal tolerance
                    this.weigh_scale.style = 'color: green;'
                    this.weigh_scale.icon = 'mdi-check-bold'
                    this.weigh_scale.belowWeight = false
                } else if (this.weigh_scale.search > this.weigh_scale.tolerance && this.weigh_scale.search <= this.weigh_scale.aboveTolerance) { // weight greater than moq but still inside tolerance
                    this.weigh_scale.style = 'color: yellow;'
                    this.weigh_scale.icon = 'mdi-arrow-down-bold'
                    this.weigh_scale.belowWeight = false
                } else if (this.weigh_scale.search > this.weigh_scale.aboveTolerance) { // weight greater than tolerance
                    this.weigh_scale.style = 'color: yellow;'
                    this.weigh_scale.icon = 'mdi-arrow-down-bold'
                    this.weigh_scale.belowWeight = true
                    this.weigh_scale.manual = false
                } else if (this.weigh_scale.search > 0 && this.weigh_scale.search < this.weigh_scale.tolerance) { // weight lower than tolerance
                    this.weigh_scale.style = 'color: red;'
                    this.weigh_scale.icon = 'mdi-arrow-up-bold'
                    this.weigh_scale.belowWeight = true
                    this.weigh_scale.manual = false
                } else {
                    this.weigh_scale.style = 'color: white;'
                    this.weigh_scale.icon = ''
                    this.callPrint = false
                    this.caution = false
                    this.weigh_scale.belowWeight = true
                    this.weigh_scale.manual = false
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
        },
    }
</script>