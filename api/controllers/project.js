'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const axios = require('axios');

const config = require('../config');
const db = require('../models');
const common = require('../common');

/**
 * @apiGroup Project
 * @api {get} /project          Query projects
 * @apiDescription              Query projects registered
 *
 * @apiParam {Object} [find]    Optional Mongo find query - defaults to {}
 * @apiParam {Object} [sort]    Optional Mongo sort object - defaults to {}
 * @apiParam {String} [select]  Fields to load - multiple fields can be entered with %20 as delimiter
 * @apiParam {String} [populate] Relational fields to populate
 * @apiParam {Number} [limit]   Optional Maximum number of records to return - defaults to 0(no limit)
 * @apiParam {Number} [skip]    Optional Record offset for pagination
 * @apiParam {Boolean} [admin]  Return all project (admin only)
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 * @apiSuccess {Object}         List of projects (maybe limited / skipped) and total count
 */
router.get('/', common.jwt({ credentialsRequired: false }), (req, res, next) => {
    var find = {};
    if (req.query.find) find = JSON.parse(req.query.find);

    var skip = req.query.skip || 0;
    let limit = req.query.limit || 100;

    var select = null;
    if (req.query.select) select = req.query.select;

    if (req.user &&
        req.user.scopes.warehouse &&
        ~req.user.scopes.warehouse.indexOf('admin') &&
        req.query.admin) {
        //admin can request all project by setting "admin" query
    } else if (req.user) {
        //only allow querying for public, or private project that user owns
        //user can see all public, private-listed or any project that they are member of
        let access_control = {
            $or: [
                { guests: req.user.sub },
                { members: req.user.sub },
                { admins: req.user.sub },
                { access: "public" },
                { listed: true }, //private project can be viewed if it's listed
            ]
        }
        find = { $and: [find, access_control] };
    } else {
        find.access = "public"; //guest can only see public projects
    }

    db.Projects.find(find)
        .select(select)
        .skip(+skip)
        .limit(+limit)
        .sort(req.query.sort || '_id')
        .populate(req.query.populate || '')
        .lean()
        .exec((err, recs) => {
            if (err) return next(err);
            /*
            console.log("query----");
            console.debug(JSON.stringify(find, null, 4));
            console.log("results----");
            console.dir(recs);
            */

            db.Projects.countDocuments(find).exec((err, count) => {
                if (err) return next(err);
                res.json({
                    projects: recs,
                    count
                });
            });
        });
});


/**
 * @apiGroup Project
 * @api {get} /project/organization/:id          Query projects from organization
 * @apiDescription              Query projects registered in organization
 *
 * @apiParam {Object} [find]    Optional Mongo find query - defaults to {}
 * @apiParam {Object} [sort]    Optional Mongo sort object - defaults to {}
 * @apiParam {String} [select]  Fields to load - multiple fields can be entered with %20 as delimiter
 * @apiParam {String} [populate] Relational fields to populate
 * @apiParam {Number} [limit]   Optional Maximum number of records to return - defaults to 0(no limit)
 * @apiParam {Number} [skip]    Optional Record offset for pagination
 * @apiParam {Boolean} [admin]  Return all project (admin only)
 *
 * @apiHeader {String} authorization
 *                              A valid JWT token "Bearer: xxxxx"
 * @apiSuccess {Object}         List of projects (maybe limited / skipped) and total count
 */

router.get('/organization/:id', common.jwt({ credentialsRequired: false }), async (req, res, next) => {
    let find = { organization: req.params.id };
    if (req.query.find) find = JSON.parse(req.query.find);

    let skip = req.query.skip || 0;
    let limit = req.query.limit || 100;
    let select = null || req.query.select;

    const organization = await common.getOrganization(req.params.id);

    if(common.isOrgAdmin(req.user, organization)){
        find = { organization: req.params.id };
    } else if (common.isOrgMember(req.user, organization)) {
        find = { organization: req.params.id,
            $or: [
                { guests: req.user.sub },
                { members: req.user.sub },
                { admins: req.user.sub },
                { access: "public_for_org" },
                { listed: true },
            ]
        };
    } else {
        return res.status(401).end("you are not a member of this organization");
    }

    db.Projects.find(find)
        .select(select)
        .skip(+skip)
        .limit(+limit)
        .sort(req.query.sort || '_id')
        .populate(req.query.populate || '')
        .lean().exec((err,recs) =>{
            if(err) return next(err);
            db.Projects.countDocuments(find).exec((err, count) => {
                if (err) return next(err);
                res.json({
                    projects: recs,
                    count
                });
            });
        });
});

/**
 * @apiGroup Project
 * @api {get} /project/query
 * @apiDescription                 Query projects based on search query (public)
 * 
 * @apiParam {String} q            Query used to search for projects
 * @apiParam {String} [select]     Fields to load - multiple fields can be entered with %20 as delimiter
 *
 * @apiHeader {String} [authorization]  
 *                                 A valid JWT token "Bearer : xxxxx"
 * 
 * @apiSuccess {Object}            Project record registered 
 */
router.get('/query', common.jwt({ credentialsRequired: false }), (req, res, next) => {
    /*lets find first all the projects*/

    //optional fields from the ui
    let select = "";
    if (req.query.select) select += req.query.select;

    //I always need these things for querying
    select += " name desc project.stats.datasets";

    common.getprojects(req.user, async (err, projectIds) => {
        if (err) return next(err);
        let projects = await db.Projects.find({
            removed: false,
            _id: { $in: projectIds },
        })
            .select(select)
            .populate('stats.datasets.datatypes_detail.type', 'name desc')
            .lean();
        if (!req.query.q) return res.json(projects);
        const queryTokens = req.query.q.toLowerCase().split(" ");

        projects.forEach(project => {
            let tokens = [
                project.name,
                project.desc,
                project.group_id.toString(),
            ];

            function addContactTokens(c) {
                if (!c) return;
                tokens.push(c.fullname);
                tokens.push(c.username);
                tokens.push(c.email);
            }

            if (project.admins) project.admins.map(common.deref_contact).forEach(addContactTokens);
            if (project.members) project.members.map(common.deref_contact).forEach(addContactTokens);
            if (project.guests) project.guests.map(common.deref_contact).forEach(addContactTokens);

            if (project.stats && project.stats.datasets && project.stats.datasets.datatypes_detail) {
                project.stats.datasets.datatypes_detail.forEach(datatype => {
                    tokens = [...tokens, datatype.type.name];
                });
            }
            tokens = tokens.filter(token => !!token).map(token => token.toLowerCase());
            project._tokens = tokens.join(" ");
        });

        const filtered = projects.filter(project => {
            let match = true;
            queryTokens.forEach(token => {
                if (!match) return;
                if (!project._tokens.includes(token)) match = false;
            });
            return match;
        });
        //remove _tokens from the apps to reduce returning weight a bit
        filtered.forEach(project => { delete project._tokens; });
        res.json(filtered);
    });
});


/**
 * @apiGroup Project
 * @api {post} /project         Post Project
 * @apiDescription              Register new project
 *
 * @apiParam {String} access    "public" or "private"
 * @apiParam {String} [name]    User friendly name for this container 
 * @apiParam {String} [desc]    Description for this dataset 
 * @apiParam {String} [readme]  Markdown content describing this project
 *
 * @apiParam {String[]} admins  Admin IDs
 * @apiParam {String[]} members Members
 * @apiParam {String[]} guests  Guest Members
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project record registered
 */
router.post('/', common.jwt(), function (req, res, next) {
    delete req.body._id; //shouldn't be set
    req.body.user_id = req.user.sub; //override (TODO - toString()?)

    //TODO - should I validate admins/members? how?

    //make sure submitter is listed as admin
    if (!req.body.admins) req.body.admins = [];
    if (!req.body.admins.includes(req.user.sub.toString())) req.body.admins.push(req.user.sub);

    console.log("creating project", req.body);

    //create a new group
    request.post({
        url: config.auth.api + "/group", headers: { authorization: req.headers.authorization }, json: true,
        body: {
            name: new Date().getTime(), //TODO - better name?
            desc: req.body.desc,
            admins: req.body.admins,
            members: req.body.members,
        }
    }, (err, _res, body) => {
        if (err) {
            //print url of post request
            console.error(config.auth.api + "/group", err);
            return next(err);
        }
        //now update the warehouse project
        var project = new db.Projects(req.body);
        project.group_id = body.group.id;
        project.save(err => {
            if (err) return next(err);
            project = JSON.parse(JSON.stringify(project));
            common.publish("project.create." + req.user.sub + "." + project._id, {})
            res.json(project);
        });
    });
});

/**
 * @apiGroup Project
 * @api {put} /project/:id
 * @apiDescription              Update project
 *
 * @apiParam {String} [access]  "public" or "private"
 * @apiParam {String} [name]    User friendly name for this container 
 * @apiParam {String} [desc]    Description for this dataset 
 * @apiParam {String} [readme]  Markdown content describing this project
 *
 * @apiParam {String[]} [admins]  List of admins (auth sub)
 * @apiParam {String[]} [members] List of admins (auth sub)
 * @apiParam {String[]} [guests]  List of guest users (auth sub)
 * @apiParam {String[]} [agreemenets]  List of data access agreemenets that user must check
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project object updated
 */
router.put('/:id', common.jwt(), (req, res, next) => {
    var id = req.params.id;
    db.Projects.findById(id, async (err, project) => {
        if (err) return next(err);
        if (!project) return res.status(404).end();
        if (!common.isAdmin(req.user, project)) return res.status(401).end("you are not an administartor of this project");

        //user can't update following fields
        delete req.body.user_id;
        delete req.body.create_date;
        delete req.body.group_id;
        for (var k in req.body) project[k] = req.body[k];

        if (req.body.admins && req.body.members) {
            await axios.put(config.auth.api + "/group/" + project.group_id, {
                name: req.body.name,
                desc: "For project " + project._id,
                admins: req.body.admins,
                members: req.body.members,
                //active: true //TODO should I deactivate group if project is removed?
                //guests: req.body.guests,
                //agreemenets: req.body.agreements,
            }, { headers: { authorization: req.headers.authorization } });
        }

        //then update the project
        project.save((err) => {
            if (err) return next(err);
            common.publish("project.update." + req.user.sub + "." + project._id, project)
            res.json(project);
        });
    });
});

/**
 * @apiGroup Project
 * @api {delete} /project/:id   Remove project
 * @apiDescription              Logically remove project by setting "removed" to true
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token "Bearer: xxxxx"
 */
router.delete('/:id', common.jwt(), function (req, res, next) {
    var id = req.params.id;

    //TODO - prevent user from removing project that's in use..
    db.Projects.findById(req.params.id, function (err, project) {
        if (err) return next(err);
        if (!project) return next(new Error("can't find the project with id:" + req.params.id));
        if (common.isAdmin(req.user, project)) {
            project.removed = true;
            project.save(function (err) {
                if (err) return next(err);

                //deactivate 
                request.put({
                    url: config.auth.api + "/group/" + project.group_id,
                    headers: { authorization: req.headers.authorization }, json: true,
                    body: {
                        active: false,
                    }
                }, (err, _res) => {
                    if (err) console.error(err);
                    common.publish("project.delete." + req.user.sub + "." + project._id, project)
                    res.json({ status: "ok" });
                });
            });

        } else return res.status(401).end();
    });
});

module.exports = router;

