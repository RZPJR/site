<template>
    <v-container fill-height class="main-container">
        <div class="box">
            <v-row class="mt24">
                <v-col cols="12" md="6" class="mt24">
                    <v-text-field
                        name="application"
                        v-model="form.application"
                        label="Application"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mt24">
                    <v-text-field
                        name="field"
                        v-model="form.field"
                        label="Field"
                        required
                        disabled
                        outlined
                        dense
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="12" class="-mt24">
                    <v-textarea
                        name="value"
                        v-model="form.value"
                        required
                        outlined
                        rows="3"
                        maxlength="300"
                        counter="300"
                        :error-messages="error.value"
                    >
                        <template v-slot:label>
                            <div>
                                Value<span style="color:red">*</span>
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </div>
        <div class="box-end">
            <v-row class="-ma16">
                <v-col>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="$router.go(-1)"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            depressed
                            color="#50ABA3"
                            class="main-btn white--text"
                            @click="confirmButton()"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </div>
        <ConfirmationDialogNew :sendData="ConfirmData" :service="'$config'"/>
    </v-container>
</template>

<script>
    import { mapState, mapActions, mapMutations } from "vuex";
    export default {
        name: "ConfigurationApplicationUpdate",
        data () {
            return {
                ConfirmData : {},
                error:{},
            }
        },
        async created(){
            await this.fetchUpdateApplicationDetail({ id: this.$route.params.id })
        },
        computed : {
            ...mapState({
                form: state => state.application.updateApplication.form
            }),
            application() {
                if (this.form.application == 1) {
                    return "Dino"
                } else if (this.form.application == 2) {
                    return "Orca"
                } else if (this.form.application == 3) {
                    return "Mantis"
                } else if (this.form.application == 4) {
                    return "Beaver"
                } else {
                    return "All"
                }
            }
        },
        methods:{
             ...mapActions([
                "fetchUpdateApplicationDetail",
            ]),
            confirmButton() {
                this.ConfirmData = {
                    model : true,
                    title : "Update Application Config",
                    text : "Are you sure want to update this Application Config?",
                    urlApi : '/configuration/v1/app/'+ this.$route.params.id,
                    nextPage : "/configuration/application",
                    data : this.form
                }
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_error', function(err){
                self.error = err
            });
        },

    }
</script>
