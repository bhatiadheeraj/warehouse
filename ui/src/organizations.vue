<template>
    <div>
        <div class="page-header">
            <div class="search-box onRight">
                <b-form-input v-model="query" type="text" placeholder="Search Organizations" @input="changeQueryDebounce" class="input"/>
                <icon name="search" class="search-icon" scale="1.5"/>
                <icon name="times" class="clear-search" scale="1.5" @click="clearQuery()" v-if="query"/>
            </div>
        </div>
        <div class="page-content">
            <b-container>
                <div v-if="!organizations" style="margin: 40px">
                    <h3>Loading ..</h3>
                </div>
                <div v-if="!organizations.length && query">
                    <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No matching organizations</p>
                </div>

                <div v-if="!organizations.length && !query">
                    <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No organization exist</p>
                </div>

                <div v-if="query && filtered.length" style="margin: 10px 0px;">
                    <div v-for="organization in filtered" :key="organization._id">
                        <organizationcard :organization="organization"/>
                        <br>
                    </div>
                </div>
                <div v-else-if="organizations.length" style="margin: 10px 0px;">
                    <div v-for="organization in organizations" :key="organization._id">
                        <organizationcard :organization="organization"/>
                        <br>
                    </div>
                </div>
            </b-container>
        </div>
        <b-button v-if="config.user" class="button-fixed" @click="navigateToNewOrganization">
            New Organization
        </b-button>
    </div>
</template>

<script>
import Vue from 'vue'
import organizationcard from '@/components/organizationcard'
let queryDebounce;
export default {
    components: { organizationcard },
    data () {
        return {
            organizations: [],
            config: Vue.config,
            query: "",
            filtered : [],
        }
    },
    created: function() {
        this.$http.get(Vue.config.auth_api+'/organization', {params: {
            find: JSON.stringify({ 
                removed: false 
            }),
            select: '-readme', //ignore some heavy stuff
        }})
        .then(res=>{
            console.log(res.data);
            this.organizations = res.data;
        }, res=>{
            console.error(res);
        });
    },
    methods: {
        changeQueryDebounce: function() {
            clearTimeout(queryDebounce);
            queryDebounce = setTimeout(this.changeQuery, 300);
        },
        changeQuery: function() {
            if(this.query) {
                this.filtered = this.organizations.filter(organization=>{
                    return organization.name.toLowerCase().includes(this.query.toLowerCase());
                });
                console.log(this.filtered);
            } else {
                this.filtered = this.organizations;
            }
        },
        clearQuery: function() {
            this.query = "";
            this.filtered = this.organizations;
        },
        navigateToNewOrganization: function() {
            this.$router.push('/organization/_/edit');
        }
    }
}
</script>