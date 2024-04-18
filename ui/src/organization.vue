<template>
    <div>
        <!-- Error handling -->
        <div v-if="error" class="error">{{ error }}</div>

        <!-- Organization information -->
        <div v-if="organization" class="page-content" style="top:0">
            <b-container fluid style="background: #ffff;">
                <b-row class="align-items-center organization-row position-relative">
                    <!-- Organization avatar -->
                    <b-col md="3" sm="12" class="avatar-container">
                        <appavatar :app="organization" class="img-logo"/>
                    </b-col>

                    <!-- Organization details -->
                    <b-col md="9" sm="12" class="organization-info">
                        <h4>{{ organization.name }}

                            <div @click="edit()" v-if="isAdmin()" class="button" title="Edit project details">
                                <icon name="edit" scale="1.25"/>
                            </div>
                        </h4>
                        <p>{{ organization.description }}</p>
                        <div class="text-muted">{{ getCountofMembers() }}
                        <span v-if="getCountofMembers() == 1">member</span>
                        <span v-else>members</span>
                        </div>
                    </b-col>
                </b-row>

                <div>
                    <b-tabs class="brainlife-tab sub-tab" v-model="tab">
                        <b-tab title="Projects" active></b-tab>
                        <b-tab title="Members" :disabled="!isAdmin()"/>
                        <b-tab title="Resources" :disabled="!isAdmin()"/>
                    </b-tabs>
                </div>
                <div v-if="tab == 0">
                    <br/>
                        <b-form inline style="gap: 10px">
                            <b-form-input v-model="query" type="text" placeholder="Search Projects" @input="change_query_debounce" class="input search">
                            </b-form-input>

                            <b-button variant="primary"
                            @click="newProject"
                            >New Project</b-button>
                        </b-form>

                    <div v-if="!projects.length && query">
                        <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No matching projects</p>
                    </div>

                    <div v-if="!projects.length && !query">
                        <p style="opacity: 0.5; margin: 20px; font-size: 120%;">No project exist</p>
                    </div>

                    <div v-if="!query && projects.length" style="margin: 10px 0px;">
                        <div v-for="project in projects" :key="project._id">
                            <projectbar :project="project"/>
                            <br>
                        </div>
                    </div>

                    <div v-else-if="query && filtered.length" style="margin: 10px 0px;">
                        <div v-for="project in filtered" :key="project._id">
                            <projectbar :project="project"/>
                        </div>
                    </div>
                </div>
                <div v-else-if="tab == 1">

                    <br/>

                    <b-form inline style="gap: 10px">
                        <b-form-input type="text" v-model="searchMemberquery" @input="searchMember" placeholder="Search Members" class="input"/>
                    </b-form>


                    <br/>
                    <div>
                        <b-card-group deck>
                            <b-card v-if="users.length" header-class="d-flex justify-content-between align-items-center" header="Members">
                                <template #header>
                                  <div class="w-100 d-flex justify-content-between align-items-center">
                                    <span>{{ users.length }} members</span>
                                    <div class="d-flex justify-content-end">
                                        <invite-user id="invite-modal" @submit-invite="inviteUser"></invite-user>
                                    </div>
                                  </div>
                                </template>
                                <b-list-group flush>
                                    <b-list-group-item
                                    v-if="!searchMemberquery && users.length"
                                    v-for="user in users"
                                    :key="user._id"
                                    class="d-flex align-items-center py-2 member-item"
                                    >
                                    <b-avatar :src="avatar_url(user,60)" class="mr-3"></b-avatar>
                                    <div class="member-info">
                                        <h5 class="member-name">{{ user.fullname }}</h5>
                                        <p class="member-username">@{{ user.username }}</p>
                                    </div>
                                    <div class="ml-auto text-muted">
                                        <span>{{ user.role.toUpperCase() }}</span>
                                    </div>
                                    <!-- // is admin but can not remove himself / herself -->
                                    <div v-if="adminCanRemove(user)" style="margin: 10px;">
                                        <button class="btn btn-sm btn-danger" @click="removeMember(user._id)">Remove</button>
                                    </div>
                                    </b-list-group-item>

                                    <b-list-group-item
                                    v-if="searchMemberquery && filteredMembers.length"
                                    v-for="user in filteredMembers"
                                    :key="user._id"
                                    class="d-flex align-items-center py-2 member-item"
                                    >
                                        <b-avatar :src="avatar_url(user,60)" class="mr-3"></b-avatar>
                                        <div class="member-info">
                                            <h5 class="member-name">{{ user.fullname }}</h5>
                                            <p class="member-username">@{{ user.username }}</p>
                                        </div>
                                        <div class="ml-auto text-muted">
                                            <span>{{ user.role.toUpperCase() }}</span>
                                        </div>

                                    </b-list-group-item>
                                </b-list-group>
                            </b-card>
                        </b-card-group>
                    </div>
                    <br/>
                    <div v-if="isAdmin && invites.length">
                        <h5>Invitations</h5>
                        <div>
                            <b-table striped hover :items="invites" class="mt-3" :fields="inviteFields">
                                <template #cell(name)="data">
                                  {{ data.item.name }}
                                </template>
                                <template #cell(username)="data">
                                  {{ data.item.username }}
                                </template>
                                <template #cell(email)="data">
                                  {{ data.item.email }}
                                </template>
                                <template #cell(role)="data">
                                  {{ data.item.role }}
                                </template>
                                <template #cell(status)="data">
                                  {{ data.item.status }}
                                </template>
                                <template #cell(expiry)="data">
                                  {{ computeExpiry(data.item.invitationExpiration) }}
                                </template>
                                <template #cell(inviterName)="data">
                                  {{ data.item.inviterName }}
                                </template>
                                <template #cell(actions)="data">
                                <b-button
                                    variant="danger"
                                    size="sm"
                                    @click="cancelInvite(data.item)"
                                    :disabled="checkCancellable(data.item)"
                                >
                                    Cancel
                                </b-button>
                                </template>
                              </b-table>
                          </div>
                      </div>
                </div>

                <!-- <div v-else-if="tab == 2">
                    <resource v-for="resource in resources.public" :resources="resources" :key="resource._id" class="resource" :resource="resource"/>
                </div> -->
            </b-container>

        </div>
    </div>
</template>


<script>
import Vue from 'vue'
import pageheader from '@/components/pageheader'
import appavatar from './components/appavatar.vue'
import projectbar from './components/projectbar.vue'
import resource from './components/resource.vue'
import inviteUser from './modals/inviteUser.vue'

const lib = require('@/lib')

export default {
    components: {
        pageheader,
        appavatar,
        projectbar,
        resource,
        inviteUser,
    },
    data() {
        return {
            organization: null,
            error: null,
            tabs : [
                {name: "Projects", id: 0},
                {name: "Members", id: 1},
            ],
            tab: 0,
            projects: [],
            query: "",
            queryDebounce: null,
            users: [],
            searchMemberquery: null,
            filteredMembers: [],
            resources: {
                mine: [],
                shared: [], //only admin should see this
                public: [],
            },
            invites: [],
            inviteFields: [
                { key: 'name', label: 'Name' },
                { key: 'username', label: 'Username' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'status', label: 'Status' },
                { key: 'expiry', label: 'Expiry' },
                { key: 'inviterName', label: 'Inviter' },
                { key: 'actions', label: 'Actions' },
            ],
        }
    },

    async created() {
        await this.load();
    },

    methods: {
        avatar_url: lib.avatar_url,
        async load() {
            await this.loadOrg()
            await this.loadProjects()
            await this.loadUsers()
            await this.loadResources()
            await this.loadInvites()
        },
        edit() {
            this.$router.push('/organization/'+this.organization._id+'/edit');
        },
        computeExpiry(expiryDate) {
            const dateExpiry = new Date(expiryDate);
            if (this.isExpired(dateExpiry)) {
                return 'Expired';
            } else {
                return `Expires on ${dateExpiry.toDateString()}`;
            }
        },
        async loadOrg() {
            const res = await this.$http.get(Vue.config.auth_api+'/organization/'+this.$route.params.id);
            this.organization = res.data;
        },
        isExpired(expiryDate) {
            return new Date(expiryDate) < new Date();
        },
        adminCanRemove(user) {
            return this.isAdmin() && user._id !== Vue.config.user.id && !this.isOwner(user._id);
        },
        checkCancellable(invite) {
            return Boolean(invite.status !== 'Pending' || this.isExpired(invite.invitationExpiration));
        },
        cancelInvite(invite) {
            this.$http.post(`${Vue.config.auth_api}/organization/${this.organization._id}/invite/cancel`,{
                invitee: invite.invitee,
            }).then(res=>{
                this.$bvToast.toast(`Invite has been cancelled`, {
                    title: 'Invite Cancelled',
                    variant: 'success',
                    solid: true,
                });

                this.loadInvites();
            }).catch(res=>{
                console.error(res);
                this.$bvToast.toast(`Failed to cancel invite`, {
                    title: 'Error',
                    variant: 'danger',
                    solid: true,
                });
            });
        },
        getCountofMembers() {
            return this.organization.roles.reduce((acc, role) => acc + role.members.length, 0);
        },
        loadProjects() {
            this.$http.get('project/organization/'+this.organization._id, {params: {
                    select: 'name desc avatar group_id stats.datasets stats.instances create_date admins members guests access',
                }}).then(res=>{
                    this.projects = res.data.projects;
                }, res=>{
                    console.error(res);
            });
        },
        loadInvites() {
            this.$http.get(Vue.config.auth_api+'/organization/'+this.organization._id+'/invitations').then(async res=>{
                this.invites = res.data;
                for (const invite of this.invites) {
                    
                    const inviteRes = await this.loadProfiles([invite.inviter]);
                    invite.inviterDetails = inviteRes[0];

                    const inviteeRes = await this.loadProfiles([invite.invitee]);
                    invite.inviteeDetails = inviteeRes[0];
                }
                this.invites = this.invites.filter(invite => invite.status !== 'Accepted');

                this.invites = this.invites.map(invite => ({
                ...invite,
                    name: invite.inviteeDetails.fullname,
                    username: invite.inviteeDetails.username,
                    email: invite.inviteeDetails.email,
                    role: invite.invitationRole,
                    status: invite.status,
                    expiry: invite.invitationExpiration,
                    inviterName: invite.inviterDetails.fullname || invite.inviterDetails.username,
                }));
            }).catch(res=>{
                console.error(res);
            });
        },
        change_query_debounce() {
           this.change_query();
        },
        searchMember() {
            if(this.searchMemberquery) {
                this.filteredMembers = this.users.filter(user=>{
                    return (user.name && user.name.toLowerCase().includes(this.searchMemberquery.toLowerCase())) || (user.email && user.email.toLowerCase().includes(this.searchMemberquery.toLowerCase()));
                });
            } else {
                this.filteredMembers = this.users;
            }
        },
        clearQuery() {
            this.query = "";
            this.filtered = this.projects;
        },

        change_query() {
            if(this.query) this.filtered = this.projects.filter(project=> project.name.toLowerCase().includes(this.query.toLowerCase()));
            else this.filtered = this.projects;
        },

        async loadProfiles(ids) {
            try {
                const response = await this.$http.get(`${Vue.config.auth_api}/profile/list`, {
                    params: {
                        find: JSON.stringify({ _id: { $in: ids } })
                    }
                });
                const profiles = response.data.profiles.filter(profile => ids.includes(profile._id));
                return profiles;
            } catch (error) {
                console.error("Error loading profiles", error);
                throw error;
            }
        },


        async loadUsers() {
            try {
                await this.loadOrg();
                const ids = this.organization.roles.flatMap(role => role.members);
                const profiles = await this.loadProfiles(ids);

                this.users = profiles.map(profile => ({
                    _id: profile._id,
                    fullname: profile.fullname,
                    username: profile.username,
                    email: profile.email,
                    role: this.findRole(profile._id),
                }));

                Vue.nextTick();
            } catch (error) {
                console.error("Error loading users", error);
            }
        },

        isAdmin(user = Vue.config.user.id) {
            const adminRole = this.organization.roles.find(role => role.role == 'admin') ;
            if(adminRole.members.includes(user) || this.organization.owner == user) return true;
        },

        findRole(user) {
            if(this.isOwner(user)) {
                return 'owner';
            }
            if(this.isAdmin(user)) return 'admin';
            else return 'member';
        },

        isOwner(id) {
            return this.organization.owner == id;
        },

        isMember(user) {
            const memberRole = this.organization.roles.find(role => role.role == 'member');
            return memberRole.members.includes(user);
        },

        loadResources() {
            this.$http.get(Vue.config.amaretti_api+'/resource', {params: {
            find: JSON.stringify(find),
            select: 'resource_id config.desc config.maxtask name citation status status_msg lastok_date active gids stats avatar'
             }}).then(res=>{
                this.resources.mine = [];
                this.resources.shared = [];
                this.resources.public = [];
                const usub = Vue.config.user.sub.toString();
                res.data.resources.forEach(r=>{
                    if(r.gids.includes(1)) {
                        this.resources.public.push(r);
                    } else if(r.user_id == usub || (r.admins && r.admins.includes(usub))) {
                        this.resources.mine.push(r);
                    } else {
                        this.resources.shared.push(r);
                    }
                });
            }).catch(console.error);
        },
        newProject() {
            this.$router.push('/project/_/edit?organization='+this.organization._id);
        },
        async inviteUser({ user, role }) {
            this.$http.post(Vue.config.auth_api+'/organization/'+this.organization._id+'/invite', {
                invitee: user._id,
                role: role,
            }).then(res=>{
                this.$bvToast.toast(`Inviting user ${user.username} as ${role}`, {
                title: 'Invitation sent',
                variant: 'success',
                solid: true,
                });
            }).catch(res=>{
                console.error(res);
                this.$bvToast.toast(`Failed to invite user ${user.username} as ${role}`, {
                title: 'Error',
                variant: 'danger',
                solid: true,
                });
            });

            this.$bvModal.hide('invite-modal');
            this.loadInvites();
        },
        isExpired(invitationDate) {
            const expiryDuration = 7;
            const expiryDate = new Date(invitationDate);
            expiryDate.setDate(expiryDate.getDate() + expiryDuration);
            return expiryDate < new Date();
        },
        async removeMember(userId) {
            this.$bvModal.msgBoxConfirm('Are you sure you want to remove this member?', {
                title: 'Remove Member',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
            }).then(value=>{
                if(value==true) {
                    this.$http.delete(Vue.config.auth_api+'/organization/'+this.organization._id+'/user/'+userId, {
                    }).then(async res=>{
                        await this.loadUsers();
                        this.$bvToast.toast('Member removed successfully', {
                            title: 'Success',
                            variant: 'success',
                            autoHideDelay: 5000
                        });
                    }).catch(err=>{
                        console.error(err);
                    });
                }
            }).catch(err=>{
                console.error(err);
            });
        }
    },
    watch: {
        tab: function() {
            if(this.tab == 0 && this.projects.length == 0) {
                this.loadProjects()
            }
        }
    },
}
</script>
<style>
.test {
    margin: 0;
    padding: 0;
}

.resource {
    border-bottom: 1px solid #0001;
}

.organization-container {
    background-color: white;
    box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
    border-radius: 4px;
}

.organization-row {
    padding: 20px;
}

.avatar-container {
    display: flex;
    align-items: center;
}


.error {
    color: red;
    padding: 20px;
}

html, body {
    margin: 0;
padding: 0;
background-color: #f8f9fa;
}

.appavatar img {
width: 100%;
height: auto;
border-radius: 50%;
}

.organization-info h4 {
margin-top: 0;
margin-bottom: 0.5rem;
color: #333;
}

.organization-info p {
margin-bottom: 1rem;
font-size: 1rem;
}

.organization-info .text-muted {
font-size: 0.875rem;
}

.img-logo {
    width: 150px ;
    height: auto;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 30px;
}

.input {
    flex-grow: 1;
}


@media (max-width: 768px) {
.organization-row {
flex-direction: column;
}

.avatar-container {
    margin-bottom: 1rem;
}

@media (max-width: 992px) {
    .avatar-container img {
        max-width: 100%;
        height: auto;
    }
    .organization-info h4, .organization-info p, .organization-info .text-muted {
        text-align: center;
    }
}

@media (max-width: 768px) {
    .organization-row {
        flex-direction: column;
        text-align: center;
    }

    .avatar-container {
        margin-bottom: 1rem;
    }

    .organization-container {
        margin: 10px;
    }
}

.position-relative {
    position: relative;
}

.edit-icon-container {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
}

.edit-icon {
    cursor: pointer;
}


}
</style>