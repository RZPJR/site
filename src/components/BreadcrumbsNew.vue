<template>
    <div class="breadcrumbs-main text-black60">
        <span v-for="(item, idx) in item" :key="idx">
            <span v-if="item.to && idx == 0">
                <router-link 
                    :to="item.to"
                >{{item.text}}</router-link>
            </span>
            <span v-else-if="item.to && idx != 0">
                &nbsp; > &nbsp;
                <router-link 
                    :to="item.to"
                >{{item.text}}</router-link>
            </span>
            <span v-else>
                &nbsp; > &nbsp; {{item.text}}
            </span>
        </span>
    </div>
</template>
<script>
export default {
    name : "BreadcrumbsNew",
    data() {
        return {
            items: [],
        }
    },
    watch: { '$route' () { this.updateList() } },
    created() {
        this.updateList()
    },
    computed:{
        item(){
            return this.items
        }
    },
    methods : {
        updateList () { 
            this.items = JSON.parse(JSON.stringify(this.$route.meta.breadcrumbs))
            for (let i = 0; i < this.items.length; i++) {
                let link = this.items[i].to
                if (link !== undefined) {
                    if (link.includes(':id')) {
                        this.items[i].to = link.replace(":id", this.$route.params.id)
                    }
                } 
            }
        }
    }
}
</script>