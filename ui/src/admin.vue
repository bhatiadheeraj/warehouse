<template>
<div class="page-content">
    <div class="page-header">
        <h4>Administration</h4>
    </div>

    <b-tabs class="brainlife-tab" v-model="tab">
        <b-tab title="Task"> 
            <br>
            <b-form inline style="margin: 0 15px;">
                <b-input-group prepent="Task ID">
                    <b-form-input v-model="task_id" placeholder="Task ID" style="width: 300px;"/>
                </b-input-group>
                &nbsp;
                <b-btn @click="loadTask()">Open</b-btn>
            </b-form>
            <br>

            <div style="padding: 20px;" v-if="depTasks.length">
                <span class="form-header">Dep Tasks</span>
                <p v-for="task in depTasks" :key="task._id">
                    <!--<b>{{task._id}}</b>-->
                    <task :task="task"/>
                </p>
            </div>

            <task v-if="task" :task="task"/>

            <div style="padding: 20px;" v-if="nextTasks.length">
                <span class="form-header">Next Tasks</span>
                <p v-for="task in nextTasks" :key="task._id">
                    <!--<b>{{task._id}}</b>-->
                    <task :task="task"/>
                </p>
            </div>
            
            <hr>
            <div style="padding: 20px" v-if="task">
                <b>Task Dump</b>
                <pre>{{task}}</pre>
            </div>

        </b-tab>
        <b-tab title="Switch User"> 
            <br>
            <div style="margin: 0 15px">
                <p>
                    <v-select 
                        @search="get_sulist" 
                        @input="su" 
                        :debounce="250" 
                        :options="su_options" placeholder="search user to become" label="fullname"/>
                </p>

                <p>
                    <b-button @click="refresh">Update Token</b-button>
                </p>
            </div>
        </b-tab>
        <b-tab title="Analytics">
            <br>
            <div style="margin: 0 15px" v-if="posCountData">
                <span class="form-header">User Categories</span>
                <small>This plot show groups of user private profile position for each users.</small>
                <ExportablePlotly :data="posCountData" :layout="posCountLayout"/>
            </div>

            <br>
            <div style="margin: 0 15px" v-if="appItems">
                <span class="form-header">App Stats</span>
                <small>{{appItems.length}} apps</small>
                <b-table :small="true" :items="appItems" :fields="appFields" selectable @row-selected="appSelected">
                    <template #cell(name)="data">
                        {{data.item.name}}
                        <b-badge v-if="data.item.removed" variant="danger">Removed</b-badge>
                        <b-badge v-if="data.item.deprecated" variant="secondary">Deprecated</b-badge>
                        <b-badge v-if="data.item.private" variant="warning">Private</b-badge>
                    </template>
                </b-table>
            </div>
        </b-tab>
        <b-tab title="Users" lazy>
            <b-container>
                <b-row>
                    <b-col>
                        <br>
                        <h5>Users</h5>
                            <b-form-input v-model="queryUser" type="text" placeholder="Search Users" @input="changeQueryDebounceUser" class="input"/>
                            <b-table :tbody-tr-class="rowClass" ref="userTable" striped hover small
                            :items="loadUsers()" 
                            :fields="fields" 
                            :per-page="perPage" 
                            :current-page="currentPage" 
                            @row-clicked="selectUser"/>
                            <b-pagination v-model="currentPage" :total-rows="rowUsers" :per-page="perPage" aria-controls="my-table"></b-pagination>
                            <p class="mt-3">Current Page: {{ currentPage }}</p>
                    </b-col>
                    <b-col>
                        <div v-if="userEdit">
                            <b-form @submit="submitUser">
                                <b-container>
                                    <b-form-group>
                                        <b-row>
                                            <b-col cols="6">
                                                <span class="form-header">Profile</span>
                                                <editor v-model="profile" @init="editorInit" lang="json" height="300"/>
                                                        <!-- <b-form-textarea v-if="userEdit.profile" v-model="userEdit.profile" rows="8"/> -->
                                            </b-col>
                                            <b-col cols="6">
                                                <span class="form-header">Scope</span>
                                                <editor v-model="scopes" @init="editorInit" lang="json" height="300"/>
                                                        <!-- <b-form-textarea v-if="userEdit.scopes" v-model="userEdit.scopes" rows="8"/> -->
                                            </b-col>
                                            <b-col cols="12">
                                                <br>
                                                <b-form-checkbox v-model="userEdit.active">Active</b-form-checkbox>
                                                <span class="form-header">Full Name</span>
                                                <b-form-input v-if="userEdit.fullname" v-model="userEdit.fullname"/>
                                                <br>
                                                <span class="form-header">Username</span>
                                                <b-form-input v-if="userEdit.username" v-model="userEdit.username"/>
                                                <br>
                                                <span class="form-header">Email</span>
                                                <b-form-input v-if="userEdit.email" v-model="userEdit.email"/>
                                                <b-form-checkbox v-model="userEdit.email_confirmed">Confirmed</b-form-checkbox>
                                                <hr>
                                                <span class="form-header">Google ID</span>
                                                <b-form-input v-if="userEdit.ext" v-model="userEdit.ext.googleid"/>
                                                <span class="form-header">Open ID</span>
                                                <b-form-input v-if="openids" v-model="openids"/>
                                                <span class="form-header">Orcid</span>
                                                <b-form-input v-if="userEdit.ext" v-model="userEdit.ext.orcid"/>
                                                <span class="form-header">Github</span>
                                                <b-form-input v-if="userEdit.ext" v-model="userEdit.ext.github"/>
                                                <hr>
                                                <pre>{{userEdit.times}}</pre>
                                            </b-col>
                                        </b-row>
                                    </b-form-group>
                                            <b-button type="submit" variant="success">Submit</b-button>
                                </b-container>
                            </b-form>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-tab>
        <b-tab title="Groups" lazy>
            <b-container>
                <b-row>
                    <b-col>
                        <h5>Groups <span style="float: right"><b-button v-on:click="initGroup()">Create Group</b-button></span></h5>
                        <b-form-input v-model="queryGroup" type="text" placeholder="Search Groups" @input="changeQueryDebounceGroup" class="input"/>
                        <b-table :tbody-tr-class="rowClass" ref="groupTable" striped hover small 
                        :items="loadGroups()" 
                        :fields="groupfields" 
                        :per-page="perPage" 
                        :current-page="currentPage"  
                        @row-clicked="selectGroup"/>
                        <b-pagination v-model="currentPage" :total-rows="rowGroups" :per-page="perPage" aria-controls="my-table"></b-pagination>
                        <p class="mt-3">Current Page: {{ currentPage }}</p>
                    </b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
        </b-tab>
    </b-tabs>
</div>
</template>

<script>
import Vue from 'vue'
import task from '@/components/task'
import ReconnectingWebSocket from 'reconnectingwebsocket'
let queryDebounceUser;
let queryDebounceGroup;
const numeral = require('numeral');

export default {
    components: { 
        task,
        ExportablePlotly: ()=>import('@/components/ExportablePlotly'),
        editor: ()=>import('vue2-ace-editor'),
    },
    data () {
        return {
            su_options: [],
            config: Vue.config,

            task_id: "",
            task: null,
            depTasks: [],
            nextTasks: [],

            ws: null,

            tab: 0,

            posCountData: null, 
            posCountLayout : {
                //"title" : "User Categories"
            },

            appItems: null,
            appFields: [
                { key: "name", label: "App Name", sortable: true },
                { key: "github", label: "Github", sortable: true },
                { key: "doi", label: "DOI", sortable: true },
                { key: "requested", label: "Execution Count", sortable: true },
                { key: "runtimeMean", label: "Avg. Walltime (min)", sortable: true },
                { key: "successRate", label: "Success Rate(%)", sortable: true },
                { key: "users", label: "Users", sortable: true },
                { key: "resourcesCount", label: "Resources", sortable: true },
            ],
            users: [],
            queryUser: "", 
            queryGroup: "",
            filteredUsers: [],
            filteredGroups: [],
            groups: [],
            fields: ["fullname", "username", "active", "email"],
            groupfields: ["name", "active"],
            perPage: 100,
            userEdit: null,
            groupEdit: null,
            profile: null,
            scopes: null,
            openids : null,
            currentPage: 1,
        }
    },

    mounted() {
    },

    watch: {
        tab(v) {
            //analytics tab
            if(v == 2) { 
                if(!this.posCountData) this.loadAnalytics();
            }
        }
    },

    methods: {
        appSelected(items) {
            const appId = items[0]._id;
            this.$router.push('/app/'+appId);
        },

        loadAnalytics() {
            console.log("loading analytics info");

            this.$http.get(Vue.config.auth_api+'/profile/poscount').then(res=>{
                let trace = {
                    values: Object.values(res.data), 
                    labels: Object.keys(res.data),  
                    type: "pie"
                };
                this.posCountData = [trace];
            });

            this.$http.get('/app', {
                params: {
                    select: 'name github stats removed doi deprecated_by projects',
                    limit: 2000,
                }
            }).then(res=>{
                this.appItems = [];
                res.data.apps.forEach(app=>{
                    if(!app.stats) return;
                    if(!app.stats.resources) app.stats.resources = [];
                    this.appItems.push({
                       _id: app._id,
                       name: app.name,
                       removed: app.removed,
                       deprecated: !!app.deprecated_by,
                       github: app.github,
                       private: !!app.projects.length,
                       doi: app.doi,
                       requested: app.stats.requested,
                       runtimeMean: numeral(app.stats.runtime_mean/(1000*60)).format('0,0'),
                       successRate: numeral(app.stats.success_rate).format('00.0'),
                       users: app.stats.users,
                       resourcesCount: app.stats.resources.length,
                    });
                });
            });
        },

        get_sulist(search, loading) {
            loading(true);
            this.$http.get(Vue.config.auth_api+'/users', { params: {
                where: JSON.stringify({
                    $or: [
                        //need to use iLike with postgres..
                        {fullname: {$regex: search, $options : 'i'}}, 
                        {email: {$regex: search, $options : 'i'}},
                    ],
                }),
                limit: 0,
            }}).then(res=>{
                this.su_options = res.data;
                loading(false);
            });
        },

        su(person) {
            if(!person) return;
            this.$http.get(Vue.config.auth_api+'/jwt/'+person.sub).then(res=>{
                localStorage.setItem("jwt", res.data.jwt);
                document.location = "/project/";
            });
        },

        refresh() {
            this.$http.post(Vue.config.auth_api+'/refresh').then(res=>{
                localStorage.setItem("jwt", res.data.jwt);
                this.$notify("refreshed");
            });
        },

        loadTask() {
            var url = Vue.config.event_ws+"/subscribe?jwt="+Vue.config.jwt;
            if(this.ws) this.ws.close();
            this.ws = new ReconnectingWebSocket(url, null, {/*debug: Vue.config.debug,*/ reconnectInterval: 3000});
            this.ws.onopen = (e)=>{
                console.log("connection opened");

                // load task detail
                this.$http.get(Vue.config.amaretti_api+'/task/'+this.task_id).then(res=>{
                    this.task = res.data;

                    //also subscribe to updates
                    this.ws.send(JSON.stringify({bind: {
                        ex: "wf.task",
                        key: this.task.instance_id+"."+this.task._id,
                    }}));

                    //load deps
                    const depIds = this.task.deps_config.map(config=>config.task);
                    this.$http.get(Vue.config.amaretti_api+'/task', { params: {
                        find: JSON.stringify({
                            //follow_task_id: this.task_id
                            "_id": {$in: [depIds]},
                        }),
                    }}).then(res=>{
                        this.depTasks = res.data.tasks;
                    }).catch(console.error);

                }).catch(err=>{
                    alert(err);
                });

                //load tasks that follows it
                this.$http.get(Vue.config.amaretti_api+'/task', { params: {
                    find: JSON.stringify({
                        //follow_task_id: this.task_id
                        "deps_config.task": this.task_id
                    }),
                }}).then(res=>{
                    this.nextTasks = res.data.tasks;
                }).catch(console.error);

                this.ws.onmessage = (json)=>{
                    let event = JSON.parse(json.data);
                    console.log("task updated!", event);
                    Object.assign(this.task, event.msg);
                }
            }
        },
        loadUsers() {
            if(!this.users.length) {
                console.log("LOADING USERS");
                this.$http.get(Vue.config.auth_api+"/users").then(res=>{
                    this.users = res.data;
                }).catch(err=>{
                    console.error(err.response);
                    this.$notify({type: "error", text: err});
                });
            }
            if(this.queryUser.length) return this.filteredUsers;
            return this.users;
        },
        loadGroups() {
            if(!this.groups.length) {
                this.$http.get(Vue.config.auth_api+"/groups").then(res=>{
                    this.groups = res.data;
                    this.groups.forEach(group=>{
                        if(group.admins) group.admins = group.admins.map(admins=>admins.sub);
                        if(group.members) group.members = group.members.map(members=>members.sub);
                    });
                }).catch(err=>{
                    console.error(err.response);
                    this.$notify({type: "error", text: err});
                });
            }
            if(this.queryGroup.length) return this.filteredGroups;
            return this.groups;
        },
        rowClass(item, type) {
            if (!item || type !== 'row') return;
            // if (item._id == this.userEdit._id || this.groupEdit._id == item._id) return 'table-success'
            if(this.userEdit && this.userEdit._id == item._id) return 'table-primary';
            if(this.groupEdit && this.groupEdit._id == item._id) return 'table-primary';
        },
        selectUser(user) {
            this.userEdit = Object.assign({}, this.userEdit, user);
            this.profile = JSON.stringify(user.profile, null, 4);
            this.scopes = JSON.stringify(user.scopes, null, 4);
            this.userEdit._index = this.users.indexOf(user);
            this.openids = user.ext.openids[0] || " ";
        },
        selectGroup(group) {
            this.groupEdit = Object.assign({}, this.groupEdit, group);
        },
        changeQueryDebounceUser() {
            clearTimeout(queryDebounceUser);
            queryDebounceUser = setTimeout(this.changeQueryUser, 300);        
        },
        changeQueryDebounceGroup() {
            clearTimeout(queryDebounceGroup);
            queryDebounceGroup = setTimeout(this.changeQueryGroup,300);
        },
        changeQueryUser() {
            if(!this.users) return setTimeout(this.changeQueryUser, 300);
            sessionStorage.setItem("user.query", this.queryUser);
            this.applyFilterUser();
        },
        changeQueryGroup() {
            if(!this.groups) return setTimeout(this.changeQueryGroup,300);
            sessionStorage.setItem("group.query", this.queryGroup);
            this.applyFilterGroup();
        },
        applyFilterUser() {
            let tokens = this.queryUser.toLowerCase().split(" ");
            this.filteredUsers = this.users.filter(user=>{
                let stuff = [
                    user.fullname,
                    user.username,
                    user.email
                ];
                const text = stuff.filter(thing=>!!thing).join(" ").toLowerCase();
                return tokens.every(token=>text.includes(token));
            });

        },
        applyFilterGroup() {
            let tokens = this.queryGroup.toLowerCase().split(" ");
            this.filteredGroups = this.groups.filter(group=>{
                let stuff = [
                    group.name,
                    group.description,
                ];
                const text = stuff.filter(thing=>!!thing).join(" ").toLowerCase();
                return tokens.every(token=>text.includes(token));
            });
        },
        submitUser(e) {
            e.preventDefault();
            this.userEdit.profile = JSON.parse(this.profile||"{}");
            this.userEdit.scopes = JSON.parse(this.scopes||"{}");
            this.userEdit.ext.openids[0] = this.openids;
            this.$http.put(Vue.config.auth_api+"/user/"+this.userEdit.sub,this.userEdit).then(res=>{
                this.$notify({type: "success", text: res.data.message});
                // this.users[this.userEdit._index] = this.userEdit;
                Vue.set(this.users, this.userEdit._index, this.userEdit);
                this.userEdit = null;
                this.scopes = null;
                this.profile = null;
            }).catch(console.error);
        },
        editorInit(editor) {
            require('brace/mode/json')
            editor.container.style.lineHeight = 1.25;
            editor.renderer.updateFontSize();
        }
    },
    computed: {
        rowUsers() {
            return this.users.length;
        },
        rowGroups() {
            return this.groups.length;
        }
    },
    watch: {
        queryUser : function() {
            this.applyFilterUser();
        },
        queryGroup: function() {
            this.applyFilterGroup();
        }
    }
}
</script>

<style scoped>
.page-header {
height: 50px;
padding: 10px;
}
.brainlife-tab {
padding-top: 0;
overflow: auto;
}
.tab-content {
position: fixed;
top: 50px;
bottom: 0;
}
.tab-content > .tab-pane {
overflow: auto;
position: absolute;
top: 40px;
left: 0px;
right: 0;
bottom: 0;
}
</style>
