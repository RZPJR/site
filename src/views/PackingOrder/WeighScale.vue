<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row>
                <v-col cols="12" class="-mb12">
                    <v-alert
                        v-if="alert"
                        icon="check"
                        prominent
                        text
                        color="#03b319"
                        border="left"
                        >
                        <v-row align="center">
                            <v-col class="grow">
                                <b>Success</b><br/>
                                Last Packing <b>{{ this.packing_code }}</b> has been printed
                            </v-col>
                            <v-col v-if="this.actualData !== this.expectedData" class="shrink">
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
                                    @click="dispose = true"
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
                            <v-col v-if="this.actualData !== this.expectedData" class="shrink">
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
                        v-model="modelWeigh"
                        outlined
                        label="Select Weigh Scale"
                        data-unq="weighscale-filter-selectWeightScale"
                        :items="selectWeigh"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt15 mb24">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-text-field
                                required
                                v-model="portIp"
                                name="search"
                                label="IP Address"
                                single-line
                                data-unq="weighscale-input-ipAdress"
                                hide-details
                                v-on="{ ...tooltip }"
                                outlined
                                onkeypress='return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)'
                                dense
                                :error="message == 'error1'"
                            ></v-text-field>
                        </template>
                        <span>Please insert the IP Address from your master device (the device is connected with weighscale and print)</span>
                    </v-tooltip>
                    <div v-if="message == 'error1'" class="mt-1 ml-3 fs12 text-red -mb2">
                        <span>Please Input IP Address</span>
                    </div>
                    <div v-if="message == 'error2'" class="mt-1 ml-3 fs12 text-green -mb2">
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
                        v-model="modelTime"
                        outlined
                        data-unq="weighscale-select-printingTime"
                        label="Select Printing Time"
                        :items="selectTime"
                        :dense="true"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="mt10 mb20">
                    <v-btn
                        depressed
                        data-unq="weighscale-button-setWeightScale"
                        color="#50ABA3"
                        class="no-caps bold mt8"
                        @click="setSetting(modelWeigh, portIp, modelTime)"
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
                                <h1 class="fs200" :style="style">
                                    <div class="d-flex align-center">
                                        {{search}}
                                        <v-icon
                                            x-large
                                            dark
                                            class="fs200"
                                            :style="style"
                                        >
                                            {{icon}}
                                        </v-icon>
                                    </div>
                                </h1>
                                <v-alert
                                    v-if="caution"
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
                        <div v-if="manual">
                            <v-btn
                                block
                                depressed
                                color="#50ABA3"
                                class="no-caps bold -mt5 mb20"
                                data-unq="weighscale-button-printWeightScale"
                                @click="manualPrint(portIp)"
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
                                    :src="product.item.item_image.image_url"
                                ></v-img>
                            <h2 class="mt16">{{ product.item.name }}</h2>
                        </div>
                        <div class="mt16">
                            <DetailRowNew :name="`Pack`" :value="`${product.pack_type} KG`"/>
                        </div>
                        <div class="flex-align-center mt25">
                            <h1>
                                {{ this.actualData }}/{{ this.expectedData }} Pack <br>
                                <div v-if="finished" class="align">
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
            v-model="dispose"
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
                        Are you sure to dispose <b>{{ this.packing_code }}</b> <br> <br>
                        Note: Make sure you tear the printout from code <b>{{ this.packing_code }}</b> if it has been cancelled
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="dispose = false"
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
            v-model="fulfill"
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
                        You have finished the packing for "<b>{{ product.item.name }} (x{{ product.pack_type }})</b>". Let's weigh the next item.
                    </span>
                </v-card-text>
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="fulfill = false"
                        class="main-btn white--text"
                        depressed
                        data-unq="weighscale-button-closeFulfill"
                        color="#50ABA3"
                    >Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <LoadingBar :value="loading"/>
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
    import Vue from 'vue'
    export default {
        name: "WeighScale",
        data() {
            return {
                url: '',
                loading: false,
                filter: true,
                loadingDispose: false,
                errorSO: false,
                fulfill: false,
                finished: false,
                filePdf: '',
                search: 0,
                so_code: '',
                websocket_status: '',
                buffer: '',
                websocket: null,
                websocketPrint: null,
                connected: false,
                connectedPrint: false,
                style: 'color: white;',
                icon: '',
                product: {
                    product: {
                        name: '',
                        product_image: []
                    }
                },
                packing: [],
                packing_code: '',
                callPrint: false,
                printed: false,
                dispose: false,
                caution: false,
                alert: false,
                ticker: 0,
                data: 0,
                data2: 0,
                dataStore: [],
                belowWeight:true,
                get_tolerance:[],
                tolerance:0,
                actualData: 0,
                expectedData: 0,
                aboveTolerance: 0,
                belowTolerance: 0,
                checkBrowser: true,
                stable_weighing_time_second: 0,
                modelWeigh: '',
                portIp: '127.0.0.1',
                manual: false,
                message: '',
                selectWeigh:[
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
                modelTime: '1000',
                selectTime: [
                    {
                        text: '5 Seconds',
                        value: '1000'
                    },
                    {
                        text: 'Manual',
                        value: '0'
                    }
                ]
            }
        },
        created() {
            //initiate connection to websocket
            this.weighConnection()
            this.printConnection()
            this.checkBrowserTab()
            this.checkStableTime()

            this.dataStore = JSON.parse(localStorage.getItem("valueWeight"))
        },
        mounted() {
            let self = this
            self.renderProduct()
            let weigh = localStorage.getItem('weigh_port')
            let time = localStorage.getItem('time')
            let ip = localStorage.getItem('ip_port')
            // get default IP
            if (ip || weigh || time) {
                self.modelWeigh = weigh
                self.portIp = ip
                self.modelTime = time
            }
            //to increment ticker and check ticker condition if its more than 5 back to zero every 1 second
            setInterval(function(){
                self.ticker += 1
                   if (self.ticker > self.stable_weighing_time_second) {
                    self.ticker = 0
                }
            }, 1000)
            // paralel check condition again if its more than 5 back to zero to ensure every 1 second
            setInterval(function(){
                if (self.ticker > self.stable_weighing_time_second) {
                    self.ticker = 0
                }
            }, 1000)
            // paralel override data2 as data from weigh scale to check the equality ever 0.1 second
            setInterval(function() {
                self.data2 = self.data
            }, 100)
            // paralel check if data not the same as data2 it will go back to zero so it will not proceed anything yet every 0.15 second
            setInterval(function() {
                if (self.data !== self.data2) {
                    self.ticker = 0
                }
            }, 110);
            // paralel data are the same it will proceed to do the print automatic or manual base on conditions
            setInterval(function(){
                if (time) {
                    if (self.ticker == self.stable_weighing_time_second && (self.data2 === self.data) && parseFloat(self.data) > 0 && self.belowWeight == false && self.checkBrowser == true && time != 0) {
                        // for automatic print 5 seconds
                        self.ticker = 0
                        if(!self.callPrint){
                            self.callPrint = true
                            self.weighScale()
                        }
                    } else if (self.ticker == self.stable_weighing_time_second && (self.data2 === self.data) && parseFloat(self.data) > 0 && self.belowWeight == false && self.checkBrowser == true && time == 0) {
                        // for manual print
                        self.ticker = 0
                        if(!self.callPrint){
                            self.callPrint = true
                            self.manual = true
                        }
                    }
                }
            }, time)
        },
        methods: {
            // to check weigh scale stable time before do action
            checkStableTime(){
                this.$http.get("/configuration/v1/app", {
                params: {
                    orderby: '-id',
                }
                }).then(res => {
                    let data = res.data.data
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].attribute === "stable_weighing_time_second"){
                            let temp_stable = data[i].value
                            this.stable_weighing_time_second = temp_stable
                        }
                    }
                });
            },
            //check browser tab if active or not
            checkBrowserTab(){
                let self = this
                document.addEventListener("visibilitychange", function() {
                    if (document.hidden) {
                        self.checkBrowser = false
                    }else{
                        self.checkBrowser = true
                    }
                });
            },
            //route to detail
            toDetail(){
                window.location.replace('/site/packing-order/detail/'+this.dataStore.packing_id);
            },
            // to manual print label
            manualPrint(){
                this.weighScale()
            },
            //to select Settings (Weigh, IP, Time)
            setSetting(weigh, ip, time) {
                if (weigh && ip && time) {
                    localStorage.setItem('weigh_port',weigh)
                    localStorage.setItem('ip_port', ip)
                    localStorage.setItem('time',time)
                    window.location.reload()
                } else {
                    this.message = 'error1'
                }
            },
            //connection method to websocket for weigh scale
            weighConnection(){
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
                this.websocketPrint = new WebSocket(`wss://${ip}:12212/printer`)
                this.websocketPrint.onopen = this.onConnectPrint
                this.websocketPrint.onclose = this.onDisconnectPrint
            },
            //reconnect websocket if disconnected or idle for weigh scale
            reconnect(){
                this.weighConnection()
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
                that.data = JSON.parse(JSON.stringify(weight))
                this.search = weight.slice(2)
                if (this.search == this.tolerance) { // weight equal tolerance
                    this.style = 'color: green;'
                    this.icon = 'mdi-check-bold'
                    this.belowWeight = false
                } else if (this.search > this.tolerance && this.search <= this.aboveTolerance) { // weight greater than moq but still inside tolerance
                    this.style = 'color: yellow;'
                    this.icon = 'mdi-arrow-down-bold'
                    this.belowWeight = false
                } else if (this.search > this.aboveTolerance) { // weight greater than tolerance
                    this.style = 'color: yellow;'
                    this.icon = 'mdi-arrow-down-bold'
                    this.belowWeight = true
                    this.manual = false
                } else if (this.search > 0 && this.search < this.tolerance) { // weight lower than tolerance
                    this.style = 'color: red;'
                    this.icon = 'mdi-arrow-up-bold'
                    this.belowWeight = true
                    this.manual = false
                } else {
                    this.style = 'color: white;'
                    this.icon = ''
                    this.callPrint = false
                    this.caution = false
                    this.belowWeight = true
                    this.manual = false
                }
            },
            //show status connected if onconnect for weigh scale
            onConnect(){
                this.connected = true
                let weigh = localStorage.getItem('weigh_port')
                let ip = localStorage.getItem('ip_port')
                let time = localStorage.getItem('time')
                this.portIp = ip
                this.modelWeigh = weigh
                this.modelTime = time
            },
            //show status disconnected if ondisconnect and try to reconnect to the websocket for weigh scale
            onDisconnect(){
                this.connected = false
                this.message = 'error2'
                this.reconnect()
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
            //is websocket connected weigh scale
            isConnected(){
                return this.connected
            },
            //is websocket connected print
            isConnectedPrint(){
                return this.connectedPrint
            },
            //to render product and get tolerance for each sku multiply by MOQ
            renderProduct(){
                this.$http.get("/site/v1/packing_order/pack/"+this.dataStore.packing_id,{params:{
                    item_id: this.dataStore.product_id,
                    pack_type: this.dataStore.pack_type
                }
                }).then(response => {
                    this.product = response.data.data
                    this.actualData = this.product.actual_total_pack
                    this.expectedData = this.product.expected_total_pack
                    this.tolerance = this.product.pack_type
                    if(this.actualData === this.expectedData){
                        this.finished = true
                    }
                    this.$http.get("/configuration/v1/app", {
                    params: {
                        orderby: '-id',
                    }
                    }).then(res => {
                        this.loading = false;
                        this.get_tolerance = res.data.data
                        for (let i = 0; i < this.get_tolerance.length; i++) {
                            let temp = this.get_tolerance[i]
                            if(temp.attribute === "percentage_packing_tolerance"){
                                let temp_tolerance = temp.value
                                let pct = (temp_tolerance / 100) * this.tolerance // (percent / 100) * value = value percentage
                                this.aboveTolerance = this.tolerance + pct // value + percentage result
                                this.belowTolerance = this.tolerance - pct // value - percentage result
                            }
                        }
                    });
                });
            },
        },
    }
</script>
