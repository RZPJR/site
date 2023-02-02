import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let path = []
let route = []
const comps = require.context('../views/', true, /\.(js)$/i);
comps.keys().map(key => {
    path.push(comps(key).default)
});
path.forEach((value, index) => {
    if (value !== undefined) {
        value.forEach((c, index) => {
            route.push(c)
        });
    }
});

let router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: route,
});

export default router;