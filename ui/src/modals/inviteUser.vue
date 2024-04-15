<template>
  <b-container fluid>
    <b-button v-b-modal.invite-modal variant="primary">Invite User</b-button>

    <b-modal id="invite-modal" title="Invite Users" hide-footer>
      <b-form @submit.prevent="onSubmit">
        <b-form-group label="Search User:" label-for="search-input">
          <b-input-group>
            <b-form-input
              id="search-input"
              v-model="search"
              type="search"
              placeholder="Enter username or email"
              @input="fetchUsers"
              autocomplete="off"
            ></b-form-input>
            <b-input-group-append>
              <b-button type="submit" variant="success">Search</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-list-group>
          <b-list-group-item
            v-for="user in userList"
            :key="user._id"
            @click="selectUser(user)"
            :class="{'selected': selectedUser && user._id === selectedUser._id}"
            class="user-list-item"
          >
            {{ user.username }} ({{ user.email }})
          </b-list-group-item>
        </b-list-group>

        <b-form-group label="Select Role:" v-if="selectedUser">
          <b-form-radio-group
            id="role-selection"
            v-model="selectedRole"
            :options="roles"
            name="role-options"
          ></b-form-radio-group>
        </b-form-group>

        <b-button type="submit" variant="info" v-if="selectedUser">Send Invite</b-button>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import debounce from 'lodash/debounce';
import Vue from 'vue';

export default {
  data() {
    return {
      search: '',
      selectedRole: 'member',
      roles: [
        { text: 'Member', value: 'member' },
        { text: 'Admin', value: 'admin' }
      ],
      userList: [],
      selectedUser: null,
    };
  },
  methods: {
    fetchUsers: debounce(function() {
      if(this.search.trim()) {
        const query = {
          $or: [
            { username: { $regex: this.search, $options: 'i' } },
            { email: { $regex: this.search, $options: 'i' } }
          ]
        };
        const where = encodeURIComponent(JSON.stringify(query));
        this.$http.get(`${Vue.config.auth_api}/profile/list?find=${where}`)
          .then(response => {
            this.userList = response.data.profiles;
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      } else {
        this.resetSearch();
      }
    }, 500),

    resetSearch() {
      this.userList = [];
      this.selectedUser = null;
    },

    selectUser(user) {
      this.selectedUser = user;
      this.search = `${user.username} (${user.email})`;
      this.userList = [];
    },

    onSubmit() {
      this.$emit('submit-invite', {
        user: this.selectedUser,
        role: this.selectedRole
      });
      this.resetSearch();
    }
  }
};
</script>

<style scoped>
  .selected {
    background-color: #007bff;
    color: white;
  }
  .user-list-item {
    cursor: pointer;
  }
</style>
