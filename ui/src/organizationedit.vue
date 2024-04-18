<template>
    <div class="organizationedit" v-if="organization">
        <div class="page-header">
            <b-container>
                <h4>{{organization.name || 'No name'}}</h4>

                <b-tabs class="brainlife-tab" v-model="tab">
                    <b-tab title="Detail"/>
                </b-tabs>
            </b-container>
        </div>
        <b-form @submit="submit" class="page-content">
            <b-container>
                <div v-if="tab == 0">
                    <br/>
                        <b-form-group label="Name">
                            <b-form-input v-model="organization.name" required/>
                        </b-form-group>
                        <b-form-group label="Description">
                            <b-form-textarea v-model="organization.description"/>
                        </b-form-group>
                </div>
            </b-container>
        <div class="page-footer">
            <b-container>
                <b-button variant="danger" @click="remove" style="float: left"><icon name="trash"/> Remove</b-button>
                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button @click="cancel">Cancel</b-button>
            </b-container>
        </div>
        </b-form>
    </div>
</template>

<script>
import Vue from 'vue'

import pageheader from '@/components/pageheader'
import contactlist from '@/components/contactlist'

const lib = require('@/lib')

export default {
    components: {
        pageheader,
        contactlist
    },
    data () {
        return {
            organization: null,
            tab: 0,
        }
    },
    created: function() {
        if(this.$route.params.id == "_"){
            this.organization = {
                name: "",
                owner: Vue.config.user.id,
                description: "",
                url: "",
                logo: "",
                color: "",
                roles: [
                    {
                        role: "admin",
                        members: [Vue.config.user.id]

                    },
                    {
                        role: "member",
                        members: []
                    }]
            }
        } else {
            this.$http.get(Vue.config.auth_api+'/organization/'+this.$route.params.id).then(res => {
                this.organization = res.data
            })
        }
    },
    methods: {
        async submit(event) {
            event.preventDefault();

            if(this.$route.params.id == "_") {
                this.$http.post(Vue.config.auth_api+'/organization/create', this.organization).then(res => {
                    this.$router.push('/organization/'+res.data._id)
                })
            } else {
                this.$http.put(Vue.config.auth_api+'/organization/'+this.$route.params.id, this.organization).then(res => {
                    this.$router.push('/organization/'+this.$route.params.id)
                })
            }
        },
        cancel() {
            this.$router.push('/organization/'+this.$route.params.id)
        },
        remove() {
            if(this.$route.params.id == "_") {
                this.$router.push('/organization');
            } else {
                if(confirm("Are you sure you want to remove this organization?")) {
                    this.$http.delete(Vue.config.auth_api+'/organization/'+this.$route.params.id).then(res => {
                        this.$router.push('/organization');
                    })
                }
            }

        }
    }
}
</script>

<style scoped>
.page-header {
    padding: 10px 0;
    height: 85px;
}
.page-header h4 {
    opacity: 0.8;
    margin-bottom: 1px;
}
.readme {
    background-color: white;
    max-height: 500px;
    overflow: auto;
    padding: 20px;
}
.container h5 {
    padding-bottom: 10px;
    margin-bottom: 10px;
    opacity: 0.7;
    border-bottom: 1px solid #ddd;
}
.page-content {
    margin-top: 40px;
}
</style>