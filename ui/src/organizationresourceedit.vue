<template>
    <div v-if="resource">
        <div class="page-header">
            <b-container>
                <h4>{{resource.name||'No name'}}</h4>
                <b-tabs class="brainlife-tab" v-model="tab">
                    <b-tab title="Detail"/>
                    <b-tab title="Apps">
                        <template v-slot:title>
                            Apps
                            <span class="resouce-apps-count__span">{{resource.config.services.length}}</span>
                        </template>
                    </b-tab>
                </b-tabs>
            </b-container>
        </div>

        <b-form>
            <div v-if="tab == 0" class="page-content">
                <b-container>
                    <b-row>
                        <b-col cols="12">
                            <b-form-checkbox v-model="resource.active">Active</b-form-checkbox>
                            <p>
                                <small>Uncheck this to temporarily disable this resource.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Name *</span>
                        </b-col>
                        <b-col cols="9">
                            <b-input type="text" v-model="resource.name" placeholder="Resource Name"/>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Organization</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <b-input type="text" v-if="organization" v-model="organization.name" readonly/>
                                <small>Organization that owns this resource.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row v-if="resource.user_id">
                        <b-col cols="3">
                            <span class="form-header">Owner</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <contact :id="resource.user_id"/>
                                <small>Users who registered this resource and administer this resource.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Administrators</span>
                        </b-col>
                        <b-col>
                            <!-- //TODO - restrict to people in org -->
                            <contactlist v-if="organization && organization.roles" v-model="resource.admins" :filteredIds="getMemberIdsOfOrg"></contactlist>
                            <p>
                                <small>Users who can administer this resource.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Projects *</span>
                        </b-col>
                        <b-col cols="9">
                            <v-select v-if="projects" :options="projects" v-model="resource.gids" :reduce="project => project.group_id" label="name" multiple>
                                <template v-slot:option="project">
                                  {{ project.name }}
                                </template>
                                <template v-slot:selected-option="project">
                                  {{ project.name }}
                                </template>
                              </v-select>
                            <p>
                                <small>Please select projects that you'd like enable this resource. Any jobs submitted by any member of specified project will be executed on this resource. You have to be listed as administrator of the project to be able to select it.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Avatar</span>
                        </b-col>
                        <b-col cols="9">
                            <b-input type="text" v-model.trim="resource.avatar" placeholder="Avatar URL"/>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Description</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <b-form-textarea :rows="4" v-model="resource.config.desc"/>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Citation</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <b-form-textarea :rows="3" v-model="resource.citation"/>
                                <small>Enter citation that should be used to acknowledge the use of this resource (in <a href="http://www.bibtex.org/Format/" target="bigtex">bibtex</a> format)</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">Login Node</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <b-input-group prepend="Username *">
                                    <b-form-input v-model.trim="resource.config.username"></b-form-input>
                                    <b-input-group-prepend is-text>Hostname *</b-input-group-prepend>
                                    <b-form-input v-model.trim="resource.config.hostname"></b-form-input>
                                </b-input-group>
                                <small>Login node used to access this resource</small>
                            </p>
                            <p>
                                <b-input-group prepend="I/O Hostname">
                                    <b-form-input v-model="resource.config.io_hostname"></b-form-input>
                                </b-input-group>
                                <small>Optional hostname used to transfer data in and out of this resource</small>
                            </p>
                            <p>
                                <b-input-group prepend="Workdir *">
                                    <b-form-input v-model.trim="resource.config.workdir"></b-form-input>
                                </b-input-group>
                                <small>Shared directory to host instance and task directories.</small>
                            </p>
                            <p>
                                <b-input-group prepend="ENV">
                                    <b-form-textarea :rows="3" v-model="envs_"/>
                                </b-input-group>
                                <small>Enter JSON dictionary with key/value pairs. The specified ENV will be set on all jobs running on this resource.</small>
                            </p>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col cols="3">
                            <span class="form-header">SSH Key</span>
                        </b-col>
                        <b-col cols="9">
                            <p>
                                <b>Public Key</b><br/>
                                <small>The following ssh public key should be stored in ~/.ssh/authorized_keys on this resource.</small>
                                <b-form-textarea :rows="6" v-model="resource.config.ssh_public"/>
                            </p>
                            <p>
                                <b>Private Key</b><br/>
                                <small>Brainlife will use the following private key to access this resource (You should not have to copy/paste this out of here).</small>
                                <b-form-checkbox v-if="resource.config.enc_ssh_private === true" v-model="resource.config.enc_ssh_private">Use the current private key</b-form-checkbox>
                                <b-form-textarea v-if="resource.config.enc_ssh_private !== true" :rows="3" v-model="resource.config.enc_ssh_private"/>
                            </p>
                            <p>
                                <b-btn @click="reset_sshkey" size="sm" :disabled="resetting_sshkey">Issue New Keypair</b-btn>
                            </p>

                        </b-col>
                    </b-row>
                </b-container>
            </div>

            <div v-if="tab == 1" class="page-content">
                <b-container>
                    <p>
                        <b-input-group prepend="Max Jobs">
                            <b-input type="text" v-model="resource.config.maxtask"/>
                        </b-input-group>
                        <small>Number of max jobs that can be submitted concurrently on this resource. Set to a higher number (10?) for batch schedulers.</small>
                    </p>

                    <p>
                        <small>The following Apps are allowed to run on this resource.</small>
                    </p>
                    <div v-for="(service, idx) in resource.config.services" :key="idx" class="resource-apps-detail__div">
                        <b-row>
                            <b-col>
                                <b-input-group>
                                    <b-input-group-prepend is-text>Name</b-input-group-prepend>
                                    <b-form-input v-model="service.name" list="service_names" trim></b-form-input>
                                    <datalist id="service_names">
                                        <option v-for="service in service_names">{{service}}</option>
                                    </datalist>
                                    <b-input-group-prepend is-text>Score</b-input-group-prepend>
                                    <b-form-input v-model="service.score"></b-form-input>
                                </b-input-group>
                            </b-col>
                            <b-col cols="auto">
                                <b-button @click="remove_service(service)" size="sm" text="Button" variant="danger"><icon name="trash"/></b-button>
                            </b-col>
                        </b-row>
                    </div>
                    <p>
                        <b-btn @click="add_service" variant="success" size="sm">Add App</b-btn>
                    </p>
                </b-container>
            </div>

            <div class="page-footer">
                <b-container>
                    <b-row no-gutters>
                        <b-col cols="auto">
                            <b-button variant="danger" @click="remove" v-if="this.resource._id"><icon name="trash"/> Remove</b-button>
                        </b-col>
                        <b-col>
                            <b-button variant="secondary" @click="cancel">Cancel</b-button>
                            <b-button variant="primary" @click="submit" :disabled="submitting"><icon v-if="submitting" name="cog" spin/> Submit</b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </b-form>

    </div>
</template>

<script>
import Vue from 'vue'
import pageheader from '@/components/pageheader'
import contactlist from '@/components/contactlist'
import contact from '@/components/contact'
import tageditor from '@/components/tageditor'

const getForge = () => import('node-forge')

export default {
    components: {
        pageheader,
        contactlist,
        contact,
        tageditor,
    },
    data() {
        return {
            resource: null,
            projects: null,
            tab: 0,
            envs_: "",
            service_names: [], // All services that user can choose from
            submitting: false,
            resetting_sshkey: false,
            config: Vue.config,
            organization: null,
        }
    },

    mounted: function() {
        this.$http.get("app", {params: {
            select: "github",
            limit: 1000,
        }}).then(res=>{
            this.service_names = res.data.apps.map(app => app.github);
            this.service_names = [...new Set(this.service_names)]; // remove duplicates
            this.service_names = this.service_names.filter(name => name && name.includes("/")); // remove odd looking service names
            this.service_names.sort();
        });

        if(this.$route.params.resourceId  !== '_') {
            //TODO USE updated url to get resource info
            // TODO use resource_cache mixin?
            this.$http.get(Vue.config.amaretti_api+'/resource', {params: {
                find: JSON.stringify({_id: this.$route.params.resourceId})
            }}).then(res=>{
                this.resource = res.data.resources[0];
                this.envs_ = JSON.stringify(this.resource.envs, null, 4);
                this.loadProjects();
            });
        } else {
            this.resource = {
                _id: null,
                active: true,
                admins: [Vue.config.user.sub],
                name: "untitled",
                avatar: "",
                config: {
                    desc: "",
                    services: [],
                    maxtask: 1,
                },
                gids: [],
                organization: this.$route.params.organizationId, //TODO - parse from url
            };
            this.reset_sshkey();
        }
        this.loadProjects();
        this.loadOrganization();

    },
    methods: {
        loadProjects() {
            // Load projects that user can share this resource with
            // restrict to only the ones in the organization
            this.$http.get('project/organization/'+this.$route.params.organizationId, {
                params: {
                    select: 'name desc group_id private admins members guests access ',
                }
            }
            ).then(res=>{
                this.projects = res.data.projects;
                this.projects.push({
                    group_id: 1,
                    name: "All Public Projects inside Organization",
                    desc: "Brainlife Administrators Only",
                });
            });
        },
        cancel() {
            this.$router.go(-1);
        },
        remove() {
            if(confirm("Do you really want to remove this resource?")) {
                this.$http.delete(Vue.config.amaretti_api+'/resource/'+this.resource._id).then(res=>{
                    //this.$router.push('/resources/');
                    this.$router.go(-2); //go all the way back to resources page
                    this.$notify({type: 'success', text: "resource removed successfully"});
                }).catch(err=>{
                    this.$notify({type: 'error', text: err.response.data.message});
                });
            }
        },

        reset_sshkey() {
            if (this.resetting_sshkey) return;
            this.resetting_sshkey = true;
            getForge()
                .then(forge => {
                    forge.pki.rsa.generateKeyPair({bits: 2048, workers: 2 }, (err, keypair) => {
                        if (err) {
                            this.$notify({type: 'error', text: err});
                            this.resetting_sshkey = false;
                            return;
                        }
                        delete this.resource.config.enc_ssh_private;
                        Vue.set(this.resource.config, 'ssh_public', forge.ssh.publicKeyToOpenSSH(keypair.publicKey));
                        Vue.set(this.resource.config, 'enc_ssh_private', forge.ssh.privateKeyToOpenSSH(keypair.privateKey));
                        this.resetting_sshkey = false;
                    });
                })
                .catch(err => {
                    this.$notify({type: 'error', text: err});
                    this.resetting_sshkey = false;
                })
        },

        submit() {
            if (this.submitting) return; // Prevent double submission
            this.submitting = true;

            if (this.envs_ && this.envs_.trim()) {
                try {
                    this.resource.envs = JSON.parse(this.envs_);
                } catch(err) {
                    this.$notify({type: 'error', text: err});
                    this.submitting = false;
                    return;
                }
            }
            if (!this.resource.gids.length) {
                this.$notify({type: 'error', text: "Please specify at least 1 project to use this resource"});
                this.submitting = false;
                return;
            }

            if(this.resource.gids.includes(1) && this.resource.gids.length > 1) {
                this.resource.gids = [1];
            }

            if (this.resource._id) { // Update resource
                this.$http.put(Vue.config.amaretti_api+'/resource/'+this.resource._id, this.resource).then(res=>{
                    this.$router.go(-1);
                    this.submitting = false;
                }).catch(err=>{
                    this.$notify({text: err.response.data.message, type: 'error' });
                    console.error(err);
                    this.submitting = false;
                });
            } else { // Create resource
                delete this.resource._id;
                this.$http.post(Vue.config.amaretti_api+'/resource', this.resource).then(res=>{
                    this.$router.replace('/resource/'+res.data._id);
                    this.submitting = false;
                }).catch(err=>{
                    this.$notify({text: err.response.data.message, type: 'error' });
                    console.error(err);
                    this.submitting = false;
                });
            }
        },

        add_service() {
            this.resource.config.services.push({
                name: "",
                score: 10,
            });
        },

        remove_service(service) {
            let pos = this.resource.config.services.indexOf(service);
            this.resource.config.services.splice(pos, 1);
        },
        loadOrganization() {
            this.$http.get(Vue.config.auth_api+'/organization/'+this.$route.params.organizationId).then(res=>{
                this.organization = res.data;
            });
        },
    },
    computed: {
        getMemberIdsOfOrg() {
            if(this.organization && this.organization.roles) {
                return this.organization.roles.flatMap(role => role.members);
            }
            return [];
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
.page-content {
    margin-top: 40px;
    padding-bottom: 60px;
}
.page-content .container {
    margin-top: 2em;
}
.page-content .container .row {
    margin-bottom: 1em;
}
small {
    opacity: 0.5;
}
.resource-apps-detail__div {
    margin-bottom: 1em;
}
.resouce-apps-count__span {
    opacity: 0.6;
    font-size: 80%;
}
.resource-projects-all_admin-message {
    color: #C00;
}
.resource-projects-all__vs__selected {
    color: #393;
    font-weight: bold;
}
.resource-projects-private__vs__selected {
    color: #999;
}
.resource-projects-all__vs__dropdown-option {
    color: #393;
    font-weight: bold;
}
.resource-projects-private__vs__dropdown-option {
    color: #999;
}
</style>