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
    watch: { '$route' (val) { localStorage.setItem("route", JSON.stringify(val)); } },
}
</script>