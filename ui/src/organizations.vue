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
                <div v-if="invites.length && !query">
                    <br/>
                    <h3>Invitations</h3>
                    <div v-for="invite in invites" :key="invite.id">
                        <invitecard :invitation="invite" />
                    </div>

                </div>
                <div v-if="!organizations" style="margin: 40px">
                    <h3>Loading ...</h3>
                </div>
                <div v-if="!organizations.length && query">
                    <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No organizations</p>
                </div>

                <div v-if="!organizations.length && !query">
                    <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No organizations</p>
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
import invitecard from '@/components/invitecard.vue'

let queryDebounce;
export default {
    components: { organizationcard, invitecard },
    data () {
        return {
            organizations: [],
            config: Vue.config,
            query: "",
            filtered : [],
            invites: [],
        }
    },
    created: function() {
        this.$http.get(Vue.config.auth_api+'/organization', {params: {
            find: JSON.stringify({ 
                removed: false 
            }),
        }})
        .then(res=>{
            this.organizations = res.data;
        }, err=>{
            console.error(err);
        });
        this.loadInvites();
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
        },
        async loadInvites() {
            try {
                let res = await this.$http.get(Vue.config.auth_api+'/organization/invitations/'+Vue.config.user.id);
                this.invites = res.data.filter(invite=>invite.status == "Pending" && new Date(invite.invitationExpiration) > new Date());
            } catch(err) {
                console.error(err);
            }
        }
    }
}
</script>