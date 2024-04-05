#!/usr/bin/env node

const async = require('async');
const axios = require('axios');
const fs = require('fs');
const mongoose = require("mongoose");

const config = require('../api/config');
const db = require('../api/models');
const common = require('../api/common');

db.init(function(err) {
    if(err) throw err;
    run();
});

function run() {
    db.Projects.find({}) //get all projects!
    .exec((err, projects)=>{
        if(err) throw err;
        async.eachSeries(projects, handle, err=>{
            if(err) {
                console.error(err);
                process.exit(1);
            }

            console.log("all done");
            db.disconnect();
        });
    });
}

async function handle(project) {
    await project.save();
}

