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
                                Last Packing <b>{{ filter.packing_code }}</b> has been printed
                            </v-col>
                            <v-col v-if="data.product.actual_total_pack !== data.product.expected_total_pack" class="shrink">
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
                                    @click="printLabel()"
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
                                    @click="filter.dispose = true"
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
                            <v-col v-if="data.product.actual_total_pack !== data.product.expected_total_pack" class="shrink">
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
            <v-row :class="showFilter ? 'mb20' : ''">
                <v-col>
                    Setting
                    <v-btn
                        depressed
                        x-small
                        @click="showFilter = !showFilter"
                        v-if="showFilter"
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
                        @click="showFilter = !showFilter"
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
                        v-model="printSetting.modelWeigh"
                        outlined
                        label="Select Weigh Scale"
                        data-unq="weighscale-filter-selectWeightScale"
                        :items="printSetting.selectWeigh"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt15 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                required
                                v-model="printSetting.ipAddress"
                                name="search"
                                label="IP Address"
                                single-line
                                data-unq="weighscale-input-ipAdress"
                                hide-details
                                v-on="{ ...tooltip }"
                                outlined
                                onkeypress='return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)'
                                dense
                                :error="filter.message == 'error1'"
                            ></v-text-field>
                        </template>
                        <span>Please insert the IP Address from your master device (the device is connected with weighscale and print)</span>
                    </v-tooltip>
                    <div v-if="filter.message == 'error1'" class="mt-1 ml-3 fs12 text-red -mb2">
                        <span>Please Input IP Address</span>
                    </div>
                    <div v-if="filter.message == 'error2'" class="mt-1 ml-3 fs12 text-green -mb2">
                        <a 
                           v-bind:href="'https://'+ printSetting.ipAddress + ':12212/'"
                           target="_blank"
                        >
                            <span>Click here to allow certificate</span>
                        </a>
                    </div>
                </v-col>
                <v-col cols="12" md="3" class="mt15">
                    <v-select
                        v-model="printSetting.modelTime"
                        outlined
                        data-unq="weighscale-select-printingTime"
                        label="Select Printing Time"
                        :items="printSetting.selectTime"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt10 mb20">
                    <v-btn
                        depressed
                        data-unq="weighscale-button-setWeightScale"
                        color="#50ABA3"
                        class="no-caps bold mt8"
                        @click="setSetting(printSetting.modelWeigh, printSetting.ipAddress, printSetting.modelTime)"
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
                                <h1 class="fs200" :style="printSetting.style">
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
                        <div v-if="printSetting.manual">
                            <v-btn
                                block
                                depressed
                                color="#50ABA3"
                                class="no-caps bold -mt5 mb20"
                                data-unq="weighscale-button-printWeightScale"
                                @click="manualPrint(printSetting.ipAddress)"
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
                                    :src="data.product.item.item_image.image_url"
                                ></v-img>
                            <h2 class="mt16">{{ data.product.item.name }}</h2>
                        </div>
                        <div class="mt16">
                            <DetailRowNew :name="`Pack`" :value="`${data.product.pack_type} KG`"/>
                        </div>
                        <div class="flex-align-center mt25">
                            <h1>
                                {{ data.product.actual_total_pack }}/{{ data.product.expected_total_pack }} Pack <br>
                                <div v-if="printSetting.finished" class="align">
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
            v-model="filter.dispose"
            persistent
            max-width="470px"
        >
            <v-card class="OpenSans">
                <LoadingBar :value="filter.loadingDispose"/>
                <v-card-title>
                    <span class="text-title-modal">
                        Dispose Packing
                    </span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">
                        Are you sure to dispose <b>{{ filter.packing_code }}</b> <br> <br>
                        Note: Make sure you tear the printout from code <b>{{ filter.packing_code }}</b> if it has been cancelled
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="filter.dispose = false"
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
                        @click="disposePacking()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="filter.fulfill"
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
                        You have finished the packing for "<b>{{ data.product.item.name }} (x{{ data.product.pack_type }})</b>". Let's weigh the next item.
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="filter.fulfill = false"
                        class="main-btn white--text"
                        depressed
                        data-unq="weighscale-button-closeFulfill"
                        color="#50ABA3"
                    >Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        name: "WeighScale",
        data() {
            return {
                showFilter: true,
                buffer: '',
                timer: null,
                dataStore: []
            }
        },
        computed: {
            ...mapState({
                weigh_scale: state => state.packingOrder.weigh_scale,
                filter: state => state.packingOrder.weigh_scale.filter,
                websocketSetting: state => state.packingOrder.weigh_scale.websocket,
                printSetting: state => state.packingOrder.weigh_scale.printSetting,
                data: state => state.packingOrder.weigh_scale.data,
            }),
        },
        created() {
            this.weighConnection()
            this.checkBrowserTab()
            this.checkStableTime()
        },
        mounted() {
            let self = this
            self.dataStore = JSON.parse(localStorage.getItem("valueWeight"))
            self.fetchPackDetail({data: self.dataStore})
            let weigh = localStorage.getItem('weigh_port')
            let ip = localStorage.getItem('ip_port')
            let time = localStorage.getItem('time')
            console.log(self.printSetting,'ini set')
            // to get first data weigh and ip from local storage
            if (ip || weigh || time) {
                this.$store.commit('setPrintSetting', {...this.printSetting, ipAddress: ip, modelWeigh: weigh, modelTime: time})
            }
            //to increment ticker and check ticker condition if its more than 5 back to zero every 1 second
            setInterval(function(){
                self.filter.ticker += 1
                if (self.filter.ticker > self.printSetting.stable_weighing_time_second) {
                    self.filter.ticker = 0
                }
            }, 1000)
            // paralel check condition again if its more than 5 back to zero to ensure every 1 second
            setInterval(function(){
                if (self.filter.ticker > self.printSetting.stable_weighing_time_second) {
                    self.filter.ticker = 0
                }
            }, 1000)
            // paralel override data2 as data from weigh scale to check the equality ever 0.1 second
            setInterval(function() {
                self.data.data2 = self.data.data
            }, 100)
            // paralel check if data not the same as data2 it will go back to zero so it will not proceed anything yet every 0.15 second
            setInterval(function() {
                if (self.data.data !== self.data.data2) {
                    self.filter.ticker = 0
                }
            }, 110);
            // paralel if its 5 second and data are the same it will proceed to do the automatic print through websocket every 1 second
            setInterval(function(){
                let self = this
                if (time) {
                    console.log('masukkk', self.weigh_scale)
                    if (self.filter.ticker == self.printSetting.stable_weighing_time_second && (self.data.data2 === self.data.data) && parseFloat(self.data.data) > 0 && self.data.belowWeight == false && self.websocketSetting.checkBrowser == true && time != 0) {
                        // for automatic print 5 seconds
                        self.filter.ticker = 0
                        if(!self.filter.callPrint){
                            self.filter.callPrint = true
                            this.fetchWeighScale()
                        }
                    } else if (self.ticker == self.printSetting.stable_weighing_time_second && (self.data.data2 === self.data.data) && parseFloat(self.data.data) > 0 && self.data.belowWeight == false && self.websocketSetting.checkBrowser == true && time == 0) {
                        // for manual print
                        self.ticker = 0
                        if(!self.filter.callPrint){
                            self.filter.callPrint = true
                            self.printSetting.manual = true
                        }
                    }
                }
            }, time)
        },
        methods: {
            ...mapActions([
                'fetchStableTime',
                'fetchPackDetail',
                'fetchWeighScale'
            ]),
            ...mapMutations([
                'setWeighPort',
                'setIpAddress',
                'setTime',
                'setFilterSetting',
                'setPrintSetting',
                'setWebsocketSetting',
            ]),
            // check stable time for weigh scale
            checkStableTime() {
                this.fetchStableTime({'type': 'stable_weighing_time_second'})
            },
            // checking browser tab
            checkBrowserTab() {
                this.$store.commit('setWebsocketSetting', {...this.websocketSetting, checkBrowser: false})
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        this.$store.commit('setWebsocketSetting', {...this.websocketSetting, checkBrowser: false})
                    } else{
                        this.$store.commit('setWebsocketSetting', {...this.websocketSetting, checkBrowser: true})
                    }
                });
            },
            // route to detail
            toDetail() {
                window.location.replace('/site/packing-order/detail/'+this.data.dataStore.packing_id);
            },
            //to select Settings (Weigh, IP)
            setSetting(weigh, ip, time) {
                if (ip) {
                    this.$store.commit('setWeighPort', weigh)
                    this.$store.commit('setIpAddress', ip)
                    this.$store.commit('setTime', time)
                    window.location.reload()
                } else {
                    this.$store.commit('setFilterSetting', {...this.filter, message: 'error1'})
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
            //connection method to websocket for print
            printConnection(){
                let ip = localStorage.getItem('ip_port')
                this.websocketSetting.websocketPrint = new WebSocket(`wss://${ip}:12212/printer`)
                this.websocketSetting.websocketPrint.onopen = this.onConnectPrint
                this.websocketSetting.websocketPrint.onclose = this.onDisconnectPrint
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
                console.log('weigh scale')
            },
            //to show and modified the translated value on input
            onUpdate(weight) {
                let that = this
                that.data.data = JSON.parse(JSON.stringify(weight))
                this.filter.search = weight.slice(2)
                if (this.filter.search == this.data.tolerance) { // weight equal tolerance
                    this.$store.commit('setPrintSetting', {
                        ...this.printSetting,
                        style: 'color: green;',
                        icon: 'mdi-check-bold',
                    })
                    this.data.belowWeight = false
                } else if (this.filter.search > this.data.tolerance && this.filter.search <= this.data.aboveTolerance) { // weight greater than moq but still inside tolerance
                    this.$store.commit('setPrintSetting', {
                        ...this.printSetting,
                        style: 'color: yellow;',
                        icon: 'mdi-arrow-down-bold',
                    })
                    this.data.belowWeight = false
                } else if (this.filter.search > this.data.aboveTolerance) { // weight greater than tolerance
                    this.$store.commit('setPrintSetting', {
                        ...this.printSetting,
                        style: 'color: yellow;',
                        icon: 'mdi-arrow-down-bold',
                    })
                    this.data.belowWeight = true
                    this.printSetting.manual = false
                } else if (this.filter.search > 0 && this.filter.search < this.data.tolerance) { // weight lower than tolerance
                    this.$store.commit('setPrintSetting', {
                        ...this.printSetting,
                        style: 'color: red;',
                        icon: 'mdi-arrow-up-bold',
                    })
                    this.data.belowWeight = true
                    this.printSetting.manual = false
                } else {
                    this.$store.commit('setPrintSetting', {
                        ...this.printSetting,
                        style: 'color: white;',
                        icon: '',
                    })
                    this.callPrint = false
                    this.caution = false
                    this.data.belowWeight = true
                    this.printSetting.manual = false
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
    }
</script>