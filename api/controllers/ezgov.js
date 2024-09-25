'use strict';

const express = require('express');
const router = express.Router();
const db = require('../models');
const common = require('../common');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const fsPromises = fs.promises;
const pdf = require('pdf-parse');
const mammoth = require("mammoth");

/**
 * @apiGroup Project
 * @api {post} /ezgov/project         Post Project
 * @apiDescription              Register a new project
 *
 * 
 * @apiParam {String} [title]    name for this project 
 * @apiParam {String} [description]    Description for this dataset 
 *
 * @apiParam {Object[]} members List of project members
 * @apiParam {String} member._id Member ID
 * @apiParam {String} member.role Member role
 * @apiParam {String} member.position Member position
 * @apiParam {String} member.name Member name
 * 
 * @apiParam {Object[]} [documents] List of project documents
 * @apiParam {String} documents._id Document ID
 * @apiParam {String} documents.projectId Project ID
 * @apiParam {String} documents.fileUrl URL of the document file
 * @apiParam {String} documents.fileName Name of the document file
 * @apiParam {Object} documents.uploadedBy Information about the uploader
 * @apiParam {Date} documents.uploadDate Date of upload
 * @apiParam {String} documents.type Type of the document
 * @apiParam {String[]} documents.lifecycle Lifecycle stages of the document
 * @apiParam {String[]} [documents.tags] Tags associated with the document
 * @apiParam {String} [documents.template] Template ID for the document
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token in the format "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project record registered
 */


router.post('/project', common.jwt(), async (req, res) => {
    try {
        const projectData = req.body;
        const isAdmin = projectData.members.some(member => member._id === req.user.id && member.role === 'admin');
        
        if (!isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Only admins can create projects' });
        }

        //TODO: user.id / user._id
        if(!projectData['createdBy']) projectData['createdBy'] = req.user.id;
        
        const requiredFields = ['title', 'description', 'primaryInstitute', 'members'];
        
        for (const field of requiredFields) {
            if (!projectData[field]) {
                return res.status(400).json({ message: `Bad Request: Missing required field ${field}` });
            }
        }

        const newProject = new db.ezGovProjects(projectData);
        const savedProject = await newProject.save();

        res.status(200).json(savedProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


/**
 * @apiGroup Project
 * @api {put} /ezgov/project/:id Update Project
 * @apiDescription              Update an existing project
 *
 * @apiParam [title]    name for this project 
 * @apiParam {String} [description]    Description for this dataset 
 * @apiParam {Object[]} members List of project members
 * @apiParam {String} members._id Member ID
 * @apiParam {String} members.role Member role
 * @apiParam {String} members.position Member position
 * 
 * @apiParam {Object[]} [documents] List of project documents
 * @apiParam {String} documents._id Document ID
 * @apiParam {String} documents.projectId Project ID
 * @apiParam {String} documents.fileUrl URL of the document file
 * @apiParam {String} documents.fileName Name of the document file
 * @apiParam {Date} documents.uploadDate Date of upload
 * @apiParam {String} documents.type Type of the document
 * @apiParam {String[]} documents.lifecycle Lifecycle stages of the document
 * @apiParam {String[]} [documents.tags] Tags associated with the document
 * @apiParam {String} [documents.template] Template ID for the document
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token in the format "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project record updated
 */

router.put('/project/:id', common.jwt(), async (req, res) => {
    try {
        const projectId = req.params.id;
        const projectData = req.body;

        const project = await db.ezGovProjects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isAdmin = project.members.some(member => member._id.toString() === req.user.id && member.role === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Only admins can update projects' });
        }

        const updatedProject = await db.ezGovProjects.findByIdAndUpdate(projectId, projectData, { new: true });

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


/**
 * @apiGroup Project
 * @api {get} /ezgov/projects   Get All Projects
 * @apiDescription              Retrieve all projects
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token in the format "Bearer: xxxxx"
 *
 * @apiSuccess {Object[]}       List of projects
 */

router.get('/projects', common.jwt(), async (req, res) => {
    try {
        let projects = await db.ezGovProjects.find({ 'members._id': req.user.id });
        projects = await Promise.all(projects.map(async (project) => {
            await project.populate('documents');
            return project;
        }));
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


/**
 * @apiGroup Project
 * @api {get} /ezgov/project/:id Get Specific Project
 * @apiDescription              Retrieve a specific project by ID
 *
 * @apiHeader {String} authorization 
 *                              A valid JWT token in the format "Bearer: xxxxx"
 *
 * @apiSuccess {Object}         Project record
 */

router.get('/project/:id', common.jwt(), async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await db.ezGovProjects.findById(projectId).populate('documents');
        console.log(project)
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMemberOrAdmin = project.members.some(member => member._id.toString() === req.user.id);
        if (!isMemberOrAdmin) {
            return res.status(403).json({ message: 'Forbidden: Only project members or admins can access this project' });
        }

        const projectObj = project.toObject ? project.toObject() : project;

        await Promise.all(projectObj.documents.map(async (document) => {
            if (document.template) {
                const template = await db.Templates.findById(document.template);
                if (!template) console.error(`Template not found for document ID: ${document._id}`);
                else document.templateName = template.name;
            }
        }));
        res.status(200).json(projectObj);
    } catch (error) {
        console.error('Internal Server Error', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Set up Multer for file uploads
const upload = multer({ dest: '/mnt/ezgov/temp/' }); // Temporary upload directory
router.post('/upload/:projectId', upload.any(), common.jwt(), async (req, res) => {
    const projectId = req.params.projectId;
    const files = req.files;
    const { types, lifecycles, authors } = req.body;

    if (!files || files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    try {
        let documents = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const dest_path = path.resolve(`/mnt/ezgov/upload/${projectId}/${file.originalname}`);

            const destdir = path.dirname(dest_path);
            mkdirp.sync(destdir);
            
            // Move the file from temp to the destination directory
            fs.renameSync(file.path, dest_path);

            const document = await new db.Document({
                fileUrl: dest_path,
                fileName: file.originalname,
                author: mongoose.Types.ObjectId(authors[i]),
                type: types[i], 
                lifecycle: lifecycles[i].split(','), 
            }).save();

            documents.push(document);
        }

        await db.ezGovProjects.findByIdAndUpdate(
            projectId,
            { $push: { documents: { $each: documents.map(doc => doc._id) } } },  // Only push document IDs
            { new: true }
        );

        res.status(200).send(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});


router.get('/project/:id/document/:docId', common.jwt(), async(req,res) => {
    try {
        const projectId = req.params.id;
        const docId = req.params.docId;

        const project = await db.ezGovProjects.findById(projectId);
        await checkProjectAccess(project, req.user.id);
        if(!project.documents.includes(docId)) res.status(400).json({message: 'Document not part of the project'});       
        const document = await db.Document.findById(docId);
        if(!document) res.status(404).json({message: "Document not Found"});
        res.status(200).json(document);       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/project/:id/document', common.jwt(), async (req, res) => {
    try {
        const projectId = req.params.id;

        let project = await db.ezGovProjects.findById(projectId);
        await checkProjectAccess(project, req.user.id);

        const documentData = req.body;
        await validateDocumentData(documentData, db);

        const newDocument = new db.Document(documentData);
        await newDocument.save();

        project.documents.push(newDocument._id);
        await project.save();

        res.status(201).json({ message: 'Document created successfully', document: newDocument });
    } catch (error) {
        console.error(error);
        if (error.message.includes('Missing') || error.message.includes('Invalid') || error.message.includes('response')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
});


router.put('/project/:id/document/:docId', common.jwt(), async (req, res) => {
    try {
        const projectId = req.params.id;
        const docId = req.params.docId;
        const updateData = req.body;

        const project = await db.ezGovProjects.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isAdmin = project.members.some(member => member._id.toString() === req.user.id && member.role === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Only admins can update documents' });
        }

        if (!project.documents.includes(docId)) {
            return res.status(404).json({ message: 'Document not found' });
        }

        let document = await db.Document.findById(docId);

        if(document.template) validateDocumentData(document, db)

        Object.keys(updateData).forEach(key => {
            document[key] = updateData[key];
        });

        await document.save();

        res.status(200).json({ message: 'Document updated successfully', document });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

const checkProjectAccess = async (project, userID) => {

    const isMemberOrAdmin = project.members.some(member => member._id.toString() == userID);
    if (!isMemberOrAdmin) {
        return res.status(403).json({ message: 'Forbidden: Only project members or admins can access this project' });
    }

    return project;
};

const validateDocumentData = async (document, db) => {
    try {
        if (!document.fileName) {
            throw new Error('Missing File Name');
        }

        if(!document.lifecycle) {
            throw new Error('Missing Lifecycle')
        }

        if(!document.type) {
            throw new Error('Missing Doc Type Field');
        }

        if (!document.template) {
            throw new Error('Missing Template');
        }

        if(!document.author) {
            throw new Error('Missing ID of author');
        } 

        const template = await db.Templates.findById(document.template);
        if (!template) {
            throw new Error('Invalid Template ID');
        }

        const fieldMap = new Map();
        template.sections.forEach(section => {
            section.fields.forEach(field => {
                fieldMap.set(field._id.toString(), field);
            });
        });

        for (let response of document.responses) {
            const field = fieldMap.get(response.fieldId.toString());
            if (!field) {
                throw new Error(`Invalid Field ID: ${response.fieldId}`);
            }

            // if (field.required && (response.response === null || response.response === undefined || response.response === '')) {
            //     // should I allow to save without finishing the required fields ?
            //     // throw new Error(`Missing response for required field: ${field.label}`);
            // }
        }

    } catch (exception) {
        throw exception;
    }
};


router.get('/project/:projectId/file/:docId', async (req, res) => {   

    const projectId = req.params.projectId;
    const docId = req.params.docId;

    const project = await db.ezGovProjects.findById(projectId);
    if(!project.documents.includes(docId)) res.status(400).message("Document does not exist in the Project");
    const document = await db.Document.findById(docId);
    const filePath = document.fileUrl;

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });

});


router.get('/project/:projectId/file/:docId/getText', common.jwt(), async (req, res) => {

    const projectId = req.params.projectId;
    const docId = req.params.docId;
    const project = await db.ezGovProjects.findById(projectId);
    await checkProjectAccess(project, req.user.id);
    
    if (!project) {
        return res.status(404).send('Project not found');
    }

    if(!project.documents.includes(docId)) res.status(400).message("Document does not exist in the Project");
    const document = await db.Document.findById(docId);
  
    if(document.template) {
        let text = "";
        const template = await db.Templates.findById(document.template);
        const responses = document.responses //Array
        template.sections.forEach((section) => {
            text += `${section.title}\n\n`;
            section.fields.forEach((field) => {
                text += `\n${field.label}(${field.description})\n`;
                const response = responses.find(resp => resp.fieldId.toString() === field._id.toString());
                if (response) {
                    text += `${response.response}\n`;
                } else {
                    text += `\n`;
                }
            });
        });
        if(text.length) return res.status(200).send(text);
        else return res.status(400).send("Unsupported File / Empty Text");
    }

    if(document.fileUrl) {
        try {
            const filePath = document.fileUrl;
            const fileExtension = path.extname(filePath).toLowerCase();
    
            fs.accessSync(filePath,fs.constants.F_OK);
    
            let text= "";
            if (fileExtension === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
            }
    
            if (fileExtension === '.pdf') {
                const dataBuffer = await fsPromises.readFile(filePath); 
                const result = pdf(dataBuffer);
                text = (await result).text 
            }
    
            if (fileExtension === ".txt") {
                text = await fsPromises.readFile(filePath, 'utf8');
            }
    
            if(text.length) return res.status(200).send(text);
            else return res.status(400).send("Unsupported File / Empty Text");
        } catch (err) {
            console.error('Internal server error:', err);
            return res.status(500).send('Internal server error');
        }
    }
});

router.get("/templates", common.jwt({ credentialsRequired: false }), async (req, res) => {
    let find = {};
    let select = "";
    if (req.query.select) select += req.query.select;
    if(req.query.find) find = JSON.parse(req.query.find); 
    const templates = await db.Templates.find(find).select(select).lean()
    return res.json(templates);
});

module.exports = router;
