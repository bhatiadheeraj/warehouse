import Vue from 'vue'

import Router from 'vue-router'

import dashboard from '@/dashboard'
import view from '@/view'
import novnc from '@/novnc'

import apps from '@/apps'
import app from '@/app'
import appedit from '@/appedit'

import projects from '@/projects'
import project from '@/project'
import projectedit from '@/projectedit'
import ezbids from '@/ezbids'

import datatypes from '@/datatypes'
import datatype from '@/datatype'
import datatypeedit from '@/datatypeedit'

import datasets from '@/datasets'
import dataset from '@/dataset'

import resources from '@/resources'
import resource from '@/resource'
import resourceedit from '@/resourceedit'

import pubs from '@/pubs'
import pub from '@/pub'
import admin from '@/admin'
import openneuro from '@/openneuro'
import settings from '@/settings'
import test from '@/test'
import missing from '@/missing'
import organizations from '@/organizations'
import organizationedit from '@/organizationedit'
import organization from '@/organization'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', redirect: '/project' },
        { path: '/dashboard', component: dashboard, meta: { sidemenu: 'dashboard' } },
        { path: '/settings/:tab?', component: settings, meta: { sidemenu: 'setting' } },
        { path: '/test', component: test, meta: { sidemenu: null } },
        { path: '/404', component: missing, meta: { public: true, sidemenu: null, noRightView: true } },
        { path: '/admin', component: admin, meta: { sidemenu: 'admin' } },

        { path: '/apps', component: apps, meta: { public: true, sidemenu: 'app' } },
        { path: '/app/:id', component: app, meta: { public: true, sidemenu: 'app' } },
        { path: '/app/:id/edit', component: appedit, meta: { sidemenu: 'app', mode: 'edit' } },
        { path: '/app/:id/copy', component: appedit, meta: { sidemenu: 'app', mode: 'copy' } },
        { path: '/app/:id/:tab?', component: app, meta: { public: true, sidemenu: 'app' } },
        // to-be-deprecated by /view?config= (still used by viewer selecter?)
        { path: '/view/:taskid/:type/:datatype64/:subdir?', component: view, props: true, meta: { noRightView: true } },
        { path: '/view', component: view, props: true, meta: { noRightView: true } },
        { path: '/novnc/:taskid/:type/:datatype64/:subdir?', component: novnc, props: true, meta: { noRightView: true } },
        { path: '/novnc', component: novnc, props: true, meta: { noRightView: true } },

        { path: '/project', redirect: '/projects' },
        { path: '/projects', component: projects, meta: { public: true, sidemenu: 'project' } },
        { path: '/project/ezbids', component: ezbids, meta: { sidemenu: 'project' } },
        { path: '/project/:id', component: project, meta: { public: true, sidemenu: 'project' } },
        { path: '/project/:id/edit', component: projectedit, meta: { sidemenu: 'project' } },
        { path: '/project/:id/:tab?/:subid?', component: project, meta: { public: true, sidemenu: 'project' } },

        { path: '/datatypes', component: datatypes, meta: { public: true, sidemenu: 'datatype' } },
        { path: '/datatypes/:id', redirect: '/datatype/:id' },
        { path: '/datatype/:id', component: datatype, meta: { public: true, sidemenu: 'datatype' } },
        { path: '/datatype/:id/edit', component: datatypeedit, meta: { sidemenu: 'datatype' } },
        { path: '/datatype/:id/:tab?', component: datatype, meta: { public: true, sidemenu: 'datatype' } },

        { path: '/datasets', component: datasets, meta: { public: true, sidemenu: 'dataset' } },
        { path: '/datasets/:key*', redirect: '/datasets/:key*' },
        { path: '/dataset/:key*', component: dataset, meta: { public: true, sidemenu: 'dataset', alias: '/datasets/:key*' } },
        { path: '/openneuro/:id*', component: openneuro, meta: { public: true, sidemenu: 'dataset' } },

        { path: '/resources', component: resources, meta: { public: true, sidemenu: 'resource' } },
        { path: '/resource/:id', component: resource, meta: { public: true, sidemenu: 'resource' } },
        { path: '/resource/:id/edit', component: resourceedit, meta: { sidemenu: 'resource' } },
        { path: '/resource/:id/:tab?', component: resource, meta: { public: true, sidemenu: 'resource' } },

        { path: '/pubs', component: pubs, meta: { public: true, sidemenu: 'pub' } },
        { path: '/pub/:id', component: pub, meta: { public: true, sidemenu: 'pub' } },

        { path: '/organization', component: organizations, meta: { public: true, sidemenu: 'organization' } },
        { path: '/organization/:id', component: organization, meta: { public: true, sidemenu: 'organization' } },
        { path: '/organization/:id/edit', component: organizationedit, meta: { sidemenu: 'organization' } },
        // { path: '/organization/:id/:tab?', component: organization, meta: { public: true, sidemenu: 'organization' } },


        { path: '/slack', beforeEnter: () => { window.location.href = 'https://join.slack.com/t/brainlife/shared_invite/zt-1now1p07p-rf6vvvcp6Aiu8XhO1om8aA' } },

    ]
})
