<template>
    <div class="invitation-card">
        <b-card>
            <b-row>
                <b-col>
                    <h5 class="mb-2">{{ invitation.organizationName }}</h5>
                    <p><strong>Role:</strong> {{ invitation.invitationRole }}</p>
                    <p><strong>Invitation Date:</strong> {{ formattedDate(invitation.invitationDate) }}</p>
                    <p v-if="inviterDetails"><strong>Invited By:</strong> {{ inviterDetails.fullname }} ({{ inviterDetails.email }})</p>

                    <p><strong style="color:red">
                    {{ computeExpiration(invitation.invitationExpiration) }}</strong>
                    </p>

                </b-col>
                <b-col cols="4" class="text-right">
                    <b-button 
                        variant="success" 
                        @click="acceptInvitation" 
                        :disabled="invitation.status !== 'Pending'">
                        Accept Invitation
                    </b-button>

                    <b-button
                        variant="danger"
                        @click="rejectInvitation"
                        :disabled="invitation.status !== 'Pending'">
                        Reject Invitation
                    </b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    props: {
        invitation: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            inviterDetails: null
        };
    },
    mounted() {
        this.loadInviterDetails();
    },
    methods: {
        formattedDate(dateString) {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        },
        async loadInviterDetails() {
            try {
                const response = await this.$http.get(`${Vue.config.auth_api}/profile/list`, {
                    params: { 
                        find: JSON.stringify({ _id: this.invitation.inviter }) 
                    }
                });
                this.inviterDetails = response.data.profiles[0];
            } catch (error) {
                console.error("Error loading inviter details", error);
            }
        },
        async acceptInvitation() {
            const res = await this.$http.post(Vue.config.auth_api + '/organization/'+this.invitation.organization+'/invite/answer', {
                response: true
            });

            if (res.status != 201) {
                this.$bvToast.toast('Failed to accept invitation', {
                    title: 'Error',
                    variant: 'danger',
                    autoHideDelay: 5000
                });
                return;
            }

            this.$bvToast.toast('Invitation accepted successfully', {
                title: 'Success',
                variant: 'success',
                autoHideDelay: 5000
            });

            this.$router.push('/organization/'+this.invitation.organization);
        },
        async rejectInvitation() {
            const res = await this.$http.post(Vue.config.auth_api + '/organization/'+this.invitation.organization+'/invite/answer', {
                response: false
            });

            this.$bvToast.toast('Invitation rejected successfully', {
                title: 'Success',
                variant: 'success',
                autoHideDelay: 5000
            });
        },
        computeExpiration(date) {
            return `Expires on ${new Date(date).toDateString()}`;
        },
    }
}
</script>

<style scoped>
.invitation-card {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid #eaeaea;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
}
</style>
