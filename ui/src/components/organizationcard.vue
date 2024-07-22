<template>
    <div class="organizationcard" :class="{clickable: clickable}" @click="click">
        <b-row>
            <b-col cols="2">
                <appavatar :app="organization" />
            </b-col>
            <b-col cols="8">
                <h4 style="margin-top: 20px">{{organization.name}}</h4>
            </b-col>
        </b-row>
    </div>

</template>

<script>
import Vue from 'vue'

import appavatar from './appavatar.vue';
export default {
    components: { appavatar },
    props: {
        organization: Object,
        clickable: {type: Boolean, default: true},
    },
    methods: {
        click() {
            if(this.clickable) {
                this.$router.push('/organization/'+this.organization._id);
            }
        }
    }
}
</script>

<style scoped>
.organizationcard {
    margin: 10px 0px;
    background-color: white;
    min-height: 80px;
    box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.5s;
    position: relative;
}
.organizationcard.clickable:hover {
    cursor: pointer;
}
</style>
