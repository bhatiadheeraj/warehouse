<template>
<v-select v-if="profiles"
    v-model.sync="values"
    :options="profiles"
    :reduce="p=>p.sub"
    label="label"
    multiple/>
</template>

<script>

import Vue from 'vue'

let profilesCache = null;

export default {
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        filteredIds: {
            type: Array,
            default: () => null,
        },
    },
    data () {
        return {
            values: [],
            profiles: null,
        }
    },

    watch: {
        /*
        value: function() {
            this.values = this.value.splice();
        },
        */

        values: function() {
            this.$emit('input', this.values);
        },
    },

    mounted: function() {
        if(this.value) this.values = this.value;

        //TODO I should let ui-select/async and let it "search" users
        if(!profilesCache) profilesCache = this.$http.get(Vue.config.auth_api+'/profile/list', {params: {
            find: JSON.stringify({active: true}),
            limit: 5000,
        }});

        profilesCache.then(res=>{
            this.profiles = [];
            res.data.profiles.forEach(profile=>{
                this.profiles.push({
                    sub: profile.sub.toString(),
                    label: profile.fullname + " <"+profile.email+">",
                    id: profile._id.toString(),
                });
            });

            if (this.filteredIds) {
                this.profiles = this.profiles.filter(p => this.filteredIds.includes(p.id));
            }

        }, res=>{
            console.error(res);
        });
    },
}
</script>
