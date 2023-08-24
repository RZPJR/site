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
            const saveRouteToLocalStorage = (dataRoute) => {
                // Create a shallow copy of the object without circular properties
                const clonedDataRoute = {...dataRoute};
                delete clonedDataRoute.matched;
                const dataRouteString = JSON.stringify(clonedDataRoute); // Convert object to string
                localStorage.setItem("route", dataRouteString);
            };
            const handleVisibilityChange = () => {
                const dataRoute = {
                    fullPath: document.visibilityState === "hidden" ? "/" : val.fullPath,
                    hash: document.visibilityState === "hidden" ? "" : val.hash,
                    meta: document.visibilityState === "hidden" ? {} : val.meta,
                    name: document.visibilityState === "hidden" ? null : val.name,
                    params: document.visibilityState === "hidden" ? {} : val.params,
                    path: document.visibilityState === "hidden" ? "/" : val.path,
                    query: document.visibilityState === "hidden" ? {} : val.query,
                };
                saveRouteToLocalStorage(dataRoute);
            };
            // Add the event listener for visibilitychange
            document.addEventListener("visibilitychange", handleVisibilityChange);
            // Check the visibility state on initial load
            handleVisibilityChange();
        }
    }
}
</script>