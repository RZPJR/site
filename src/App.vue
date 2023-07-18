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
    watch: { '$route' (val) { this.setRouter(val), this.checkBrowserTab(val) } },
    created() {
        this.setRouter(this.$router.history.current)
        this.checkBrowserTab(this.$router.history.current)
    },
    methods : {
        setRouter(val) {
            const shallowCopy = {...val};
            localStorage.setItem("route", JSON.stringify(shallowCopy));
        },
        checkBrowserTab(val) {
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible" && val.name !== null) {
                    const dataRoute = {
                        fullPath: val.fullPath,
                        hash: val.hash,
                        matched: val.matched,
                        meta: val.meta,
                        name: val.name,
                        params: val.params,
                        path: val.path,
                        query: val.query,
                    }
                    // Create a shallow copy of the object without circular properties
                    const clonedDataRoute = {...dataRoute};
                    delete clonedDataRoute.matched;
                    const dataRouteString = JSON.stringify(clonedDataRoute); // Convert object to string
                    localStorage.setItem("route", dataRouteString);
                   
                }
            });
        }
    }
}
</script>