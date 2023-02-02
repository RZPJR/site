<template>
    <v-container fill-height class="main-container">
        <div class="box-start">
            <v-row class="-mb38">
                <v-col cols="12" md="3">
                    <SelectGlossary
                        :dense="true"
                        @selected="AppsSelected"
                        label="Application"
                        table="all"
                        attribute="application"
                        :norequired="true"
                    ></SelectGlossary>
                </v-col>
            </v-row>
        </div>
        <div class="box-table">
            <v-data-table
                :headers="applicationList.table_headers"
                :items="applicationList.data"
                :loading="applicationList.isLoading"
                :items-per-page="10"
            >
                <template v-slot:item="props">
                    <tr style="height:48px">
                        <td>
                            <div v-if="props.item.application == 1">{{ 'Dino' }}</div>
                            <div v-else-if="props.item.application == 2">{{ 'Orca' }}</div>
                            <div v-else-if="props.item.application == 3">{{ 'Mantis' }}</div>
                            <div v-else-if="props.item.application == 4">{{ 'Beaver' }}</div>
                            <div v-else-if="props.item.application == 0">{{ 'All' }}</div>
                            <div v-else>{{ 'All' }}</div>
                        </td>
                        <td>{{ props.item.field }}</td>
                        <td>{{ props.item.attribute }}</td>
                        <td>{{ props.item.value }}</td>
                        <td>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on: menu }">
                                    <v-btn
                                        icon
                                        v-on="{ ...menu }"
                                    ><v-icon dark>more_vert</v-icon></v-btn>
                                </template>
                                <v-list class="bg-white">
                                    <v-list-item :to="`/configuration/application/update/${props.item.id}`" v-privilege="'app_upd'">
                                        <v-list-item-content>
                                            <v-list-item-title>Update</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-icon>open_in_new</v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    import { mapState, mapActions, mapMutations } from "vuex";
    export default {
        name: "ConfigurationApplication",
        created() {
            this.fetchApplicationList()
        },
        computed:{
            ...mapState({
                applicationList: state => state.application.applicationList,
            }),
        },
        methods: {
            ...mapActions([
                "fetchApplicationList"
            ]),
            ...mapMutations([
                "setGlossaryFilterList",
            ]),
            AppsSelected(d) {
                this.$store.commit("setGlossaryFilterList", null)
                if (d !== '' && d !== undefined) {
                    this.$store.commit("setGlossaryFilterList", d.value)
                }
                this.fetchApplicationList()
            },
        },
    }
</script>