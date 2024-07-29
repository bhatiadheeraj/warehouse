<template>
<div class="projectedit" v-if="project">
    <div class="page-header">
        <b-container>
            <!--
            <p style="float: right">
                <b-button size="sm" variant="outline-secondary" href="https://brainlife.io/docs/user/project" target="doc">
                    <icon name="book"/> Documentation
                </b-button>
            </p>
            -->
            <h4>{{project.name||'No name'}}</h4>
            <b-tabs class="brainlife-tab" v-model="tab">
                <b-tab title="Detail"/>
                <b-tab title="Access Control"/>
                <b-tab title="Participants Info"/>
                <b-tab title="Resources"/>
            </b-tabs>
        </b-container>
    </div>

    <b-form @submit="submit" class="page-content">
        <b-container>
            <br>
            <!--detail-->
            <div v-if="tab == 0">
                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Name *</span>
                    </b-col>
                    <b-col cols="9">
                        <b-input type="text" v-model="project.name" placeholder="Project Name" required/>
                        <br>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Description *</span>
                    </b-col>
                    <b-col cols="9">
                        <p style="position: relative">
                            <span @click="showMart = true" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">😋</span>
                            <b-form-textarea v-model="project.desc" placeholder="Enter description for this project." required/>
                            <emojimart v-if="showMart" @select="addEmojiToDesc" style="position: absolute; z-index: 5; right: 0;"/>
                        </p>
                    </b-col>
                </b-row>

                <b-row v-if="organizations && organizations.length">
                    <b-col cols="3">
                        <span class="form-header">Organization</span>
                    </b-col>
                    <b-col cols="9">
                        <b-form-select v-if="organizations && organizations.length" v-model="project.organization" :options="organizations.map(org=>{return {text: org.name, value: org._id}})"/>
                    </b-col>
                </b-row>

                <br/>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Avatar</span>
                    </b-col>
                    <b-col cols="9">
                        <b-input type="text" v-model.trim="project.avatar" placeholder="Image URL for the project avatar (if not set, randomly generate)"/>
                        <p class="text-muted"><small>You can try choosing an image from websites like https://picsart.com/</small></p>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">README</span>
                    </b-col>
                    <b-col cols="9">
                        <b-form-textarea :rows="4" :max-rows="20" v-model="project.readme" placeholder="Enter extended README content"/>
                        <p>
                            <small class="text-muted">You can use <a href="https://help.github.com/articles/basic-writing-and-formatting-syntax/" target="_blank">markdown format</a></small>
                        </p>
                    </b-col>
                </b-row>
            </div>


            <!--access control-->
            <div v-if="tab == 1">
                <!--<h5>Access Control</h5>-->
                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Access Policy</span>
                    </b-col>
                    <b-col cols="9">
                        <b-form-radio-group v-model="project.access">
                            <p>
                                <b-form-radio value="public">Public</b-form-radio> <br>
                                <small class="text-muted">Datasets are accessible to any users but only project member can update them.</small>
                            </p>
                            <p>
                                <b-form-radio value="private">Private</b-form-radio> <br>
                                <small class="text-muted">Only the members of project can access datasets. Guest users has read access to the datasets.</small>
                           </p>

                           <p v-if="project.organization">
                                <b-form-radio value="public_for_org">Public For Organization</b-form-radio> <br>
                                <small class="text-muted">
                                    The project will be accessible to all users in the organization. Only the members of project can update datasets. Guest users has read access to the datasets.
                                </small>
                           </p>

                        </b-form-radio-group>
                        <p>
                            <b-form-checkbox v-if="project.access == 'private'" style="margin-left: 30px;" v-model="project.listed">List project summary for all users</b-form-checkbox>
                        </p>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">DATA USE AGREEMENT</span>
                    </b-col>
                    <b-col cols="9">
                        <p class="text-muted"><small>List of agreements that user must agree before accessing datasets stored on this project</small></p>
                        <b-row v-for="(agreement, idx) in project.agreements" :key="idx">
                            <b-col>
                                <b-form-textarea v-model="agreement.agreement" placeholder="Enter agreement text(markdown) to be presented to the user"/>
                                <br>
                            </b-col>
                            <b-col cols="1">
                                <div class="button" @click="remove_agreement(idx)"><icon name="trash"/></div>
                            </b-col>
                        </b-row>
                        <!-- <p><b-button @click="project.agreements.push({agreement: ''})" size="sm"><icon name="plus"/> Add Agreement</b-button></p> -->
                        <b-dropdown  split class="m-2" @click="addAgreement('empty')">
                            <template #button-content>
                                Add Agreement
                            </template>
                            <b-dropdown-item-button @click="addAgreement('brainlife_dua')">Brainlife Data Use Agreement - Template </b-dropdown-item-button>
                        </b-dropdown>

                        <b-button variant='info' @click="$bvModal.show('ezgov-import-modal')" class="m-2">Import from ezGOV</b-button>
                        <ezgovimporter @importedText="handleImportedText" />
                        <br>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Administrators</span>
                    </b-col>
                    <b-col cols="9">

                        <contactlist
                            v-if="organizations && organizations.length && project.organization"
                            v-model="project.admins"
                            :filteredIds="getMemberIdsOfOrg"
                        />

                        <contactlist v-else v-model="project.admins"/>

                        <p class="text-muted"><small>Users who can update the project metadata, and groups</small></p>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Members</span>
                    </b-col>
                    <b-col cols="9">
                        <contactlist
                        v-if="organizations && organizations.length && project.organization"
                        v-model="project.members"
                        :filteredIds="getMemberIdsOfOrg"
                        />

                        <contactlist v-else v-model="project.members"/>

                        <p class="text-muted"><small>Users who can update datasets in this project. Also for a private project: Users who can run Apps registered on this project.</small></p>     
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="3">
                        <span class="form-header">Guests</span>
                    </b-col>
                    <b-col cols="9">
                        <contactlist
                        v-if="organizations && organizations.length && project.organization"
                        v-model="project.guests"
                        :filteredIds="getMemberIdsOfOrg"
                        />
                        <contactlist v-else v-model="project.guests"/>

                        <p class="text-muted"><small>For Private project, users who has read access to datasets.</small></p>
                    </b-col>
                </b-row>
            </div>

            <!--participants info-->
            <div v-if="tab == 2">

                <p> <small>phenotype (aka participants data) allows you to store subject specific information used to perform group analysis.</small> </p>
                <b-form-checkbox v-model="project.publishParticipantsInfo">
                    Publish Participants Info<br>
                    <small>
                        Participants information will be made public and included as part of publications from this project. Please be sure to only include information authorized by your IRB or consented by your test subjects. Do not include any identifiable information.
                    </small>
                </b-form-checkbox>
                <br>

                <div v-if="participants !== undefined">
                    <h5>Participants Info</h5>
                    <p class="text-muted"><small>Key/value dictionary for each subject (participants.tsv). You can use this information in analysis tab. It should be array of objects containing at least 'subject' key and other fields</small></p>
                    <editor v-model="participants" @init="editorInit" lang="json" height="500"/>
                    <br>
                </div>

                <div v-if="participants !== undefined">
                    <h5>Column Definitions</h5>
                    <p class="text-muted"><small>Participants Info column Definitions (participants.json). Please read the <a href="https://bids-specification.readthedocs.io/en/stable/03-modality-agnostic-files.html#phenotypic-and-assessment-data">BIDS specification</a></small></p>
                    <editor v-model="participants_columns" @init="editorInit" lang="json" height="300"/>
                    <br>
                </div>
            </div>

            <!--resources-->
            <div v-if="tab == 3">
                <h5>Compute Resources</h5>
                <span class="form-header">Public Resources</span>
                <b-form-checkbox v-model="project.noPublicResource">
                    <p style="padding-left: 15px">Do not compute on brainlife public resources<br>
                        <small>By default, all project will have access to brainlife's public resources. Please check this if you'd like to not use public resources to process your data stored in this project.</small>
                    </p>
                </b-form-checkbox>
                <br>

                <div v-if="sharedResources && sharedResources.length">
                    <span class="form-header">Private Resources</span>
                    <small>The following resources are allowed to be used for this project.</small>
                    <resource v-for="resource in sharedResources" :key="resource._id" :resource="resource"/>
                </div>
            </div>

            <div class="page-footer">
                <b-container>
                    <b-button variant="danger" @click="remove" style="float: left"><icon name="trash"/> Remove</b-button>
                    <b-button variant="secondary" @click="cancel">Cancel</b-button>
                    <b-button type="submit" variant="primary" :disabled="submitting"><icon v-if="submitting" name="cog" spin/> Submit</b-button>
                </b-container>
            </div>

            <br>
            <br>
            <br>
        </b-container>

        <div v-if="config.debug">
            <pre>{{JSON.stringify(project, null, 4)}}</pre>
        </div>
    </b-form><!--page-content-->
</div>
</template>

<script>
import Vue from 'vue'

import pageheader from '@/components/pageheader'
import contactlist from '@/components/contactlist'
import license from '@/components/license'
import VueMarkdown from 'vue-markdown'

import datatypeselecter from '@/components/datatypeselecter'
import datatype from '@/components/datatype'
import tageditor from '@/components/tageditor'

import datatypes from '@/mixins/datatypes'
import { Picker } from 'emoji-mart-vue'
import { brainlife_dua } from "@/assets/consents.js";
import ezgovimporter from '@/modals/ezgovimporter';

const lib = require('@/lib');

export default {
    mixins: [ datatypes ],
    components: {
        contactlist,
        pageheader,
        license,
        VueMarkdown,

        datatypeselecter,
        datatype,
        tageditor,

        resource: ()=>import('@/components/resource'),
        emojimart: Picker,

        editor: require('vue2-ace-editor'),
        ezgovimporter
    },

    data() {
        return {
            project: null,
            participants: null,
            participants_columns: null,

            showMart: false,

            sharedResources: null,

            submitting: false,

            tab: 0,

            config: Vue.config,
            organizations: [],
        }
    },

    mounted: function() {

        let participants_def = [
            {subject: "001", age: 12, sex: "F", "handedness": "R"},
            {subject: "002", age: 34, sex: "M", "handedness": "L"},
        ];

        let participants_columns_def = {
            "gender" : {
                "LongName" : "gender",
                "Description" : "gender",
                "Levels" : {
                    "M" : "male",
                    "F" : "female"
                }
            },
            "handedness" : {
                "LongName" : "handedness",
                "Description" : "handedness",
                "Levels" : {
                    "R" : "right",
                    "L" : "left"
                }
            },
            "age" : {
                "LongName" : "age",
                "Units" : "years"
            },
        }

        //load datatypes using mixin
        this.loadDatatypes({}, async err=>{
            if(err) {
                console.error(err);
                return;
            }

            if(this.$route.params.id !== '_') {
                //load project to edit
                this.axios.get('project', {params: {
                    find: JSON.stringify({_id: this.$route.params.id})
                }}).then(res=>{
                    this.project = res.data.projects[0];

                    //initialize missing fields (mainly for backward compatibility)
                    if(!this.project.agreements) Vue.set(this.project, "agreements", []);

                    //load shared resources
                    this.$http.get(Vue.config.amaretti_api+'/resource', {params: {
                        find: {
                            gids: this.project.group_id,
                            removed: false,
                        },
                        select: 'name active config.hostname config.desc status avatar',
                    }}).then(res=>{
                        this.sharedResources = res.data.resources;
                    });
                });

                //load participant info
                this.axios.get("/participant/"+this.$route.params.id).then(res=>{
                    if(res.data) {
                        this.participants = JSON.stringify(res.data.subjects||participants_def, null, 4);
                        this.participants_columns = JSON.stringify(res.data.columns||participants_columns_def, null, 4);
                    }
                });

            } else {
                //new project
                this.project = {
                    _id: null,
                    name: "New Project",
                    desc: "",
                    access: "private",

                    admins: [Vue.config.user.sub],
                    members: [],
                    guests: [],

                    agreements: [],

                    limitResource: false,
                };

                if (this.$route.query.organization) {
                    this.project.organization = this.$route.query.organization;
                }

                this.participants = JSON.stringify(participants_def, null, 4);
                this.participants_columns = JSON.stringify(participants_columns_def, null, 4);
            }
        });
        this.listOrganizations();
    },

    computed: {
    getMemberIdsOfOrg() {
        if (!this.project || !this.project.organization) {
            return [];
        }

        const org = this.organizations.find(org => org._id === this.project.organization);

        if (org && org.roles) {
            return org.roles.flatMap(role => role.members);
        }
        return [];
    }
},


    methods: {

        cancel() {
            //if(this.project._id) this.$router.push('/project/'+this.project._id);
            //else this.$router.push('/project');
            this.$router.go(-1);
        },

        remove() {
            if(confirm("Do you really want to remove this project?")) {
                this.$http.delete('project/'+this.project._id)
                .then(res=>{
                    this.$notify('successfully removed the project');
                    this.$router.push('/projects');
                });
            }
        },

        addEmojiToDesc(emoji) {
            this.project.desc += emoji.native;
            this.showMart = false;
        },

        remove_agreement(idx) {
            this.project.agreements.splice(idx, 1);
        },

        editorInit(editor) {
            lib.editorInit(editor, ()=>{
                //nothing else to load
            });
        },

        submit(evt) {
            if(this.submitting) return;
            evt.preventDefault();

            //validate
            let participants;
            let participants_columns;
            try {
                participants = JSON.parse(this.participants||"[]");
                participants_columns = JSON.parse(this.participants_columns||"{}");
            } catch(err) {
                this.$notify({type: 'error', text: "Participants Info has a syntax error: "+err});
                return;
            }

            //make sure participatns info is structured in the correct way
            if(!Array.isArray(participants)) {
                this.$notify({type: 'error', text: "Participants info should be an array"});
                return;
            }
            if(participants.some(rec=>!rec.subject)) {
                this.$notify({type: 'error', text: "subject field is missing in some record for participants info"});
                return false;
            }

            this.submitting = true;
            if(this.project._id) {
                //update
                this.axios.put('project/'+this.project._id, this.project).then(res=>{
                    this.$root.$emit("refresh_jwt");
                    return this.axios.put('participant/'+this.project._id, {
                        subjects: participants,
                        columns: participants_columns,
                    });
                }).then(res=>{
                    this.$router.go(-1);
                    this.submitting = false;
                }).catch(err=>{
                    console.error(err);
                    this.$notify({text: err.response.data.message, type: 'error' });
                    this.submitting = false;
                });
            } else {
                //create
                let project;
                this.axios.post('project', this.project).then(res=>{
                    project = res.data;
                    this.$root.$emit("refresh_jwt");
                    return this.axios.put('participant/'+project._id, {
                        subjects: participants,
                        columns: participants_columns,
                    });
                }).then(res=>{
                    this.$router.replace("/project/"+project._id);
                    this.submitting = false;
                }).catch(err=>{
                    console.error(err);
                    this.$notify({text: err.response.data.message, type: 'error' });
                    this.submitting = false;
                });
            }
        },

        addAgreement(type) {
            if(type == 'empty') this.project.agreements.push({agreement: ''});
            if(type == 'brainlife_dua') this.project.agreements.push({
                agreement: brainlife_dua,
            })
        },
        handleImportedText(text) {
            this.project.agreements.push({ agreement: text });
        }
    },
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

