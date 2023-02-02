<template>
  <v-app>
    <div id="microApp">
      <v-main>
        <BreadcrumbsNew v-if="$route.meta.breadcrumbs"/>
        <router-view></router-view>
      </v-main>
    </div>
  </v-app>
</template>

<script>
    import BreadcrumbsNew from "./components/BreadcrumbsNew.vue";
    export default {
        name: "App",
        components: {
            BreadcrumbsNew
        },
    };
</script>