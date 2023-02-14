<template>
    <v-app>
        <div id="microApp">
            <v-main>
                <router-view></router-view>
            </v-main>
        </div>
    </v-app>
</template>
<script>
export default {
    watch: { '$route' (val) { this.setRouter(val) } },
    created() {
        this.setRouter(this.$router.history.current)
    },
    methods : {
        setRouter(val) {
            localStorage.setItem("route", JSON.stringify(val));
        }
    }
}
</script>