const db = require('../api/models');

const templates = [{
    "name": "OSF-Standard Pre-Data Collection Registration Template",
    "source": "Open Science Foundation",
    "type": "Pre-Registration",
    "description": "A detailed template to guide the pre-data collection registration process on OSF, including necessary documentation and metadata setup. This template ensures that all necessary aspects of project setup are comprehensively covered.",
    "sections": [
      {
        "title": "Metadata",
        "fields": [
          {
            "label": "Title",
            "description": "The main title of your project or study.",
            "type": "text",
            "required": true
          },
          {
            "label": "Description",
            "description": "A brief overview of the project including its main objectives and significance.",
            "type": "textarea",
            "required": true
          },
          {
            "label": "Contributors",
            "description": "List of all contributors and their roles in the project.",
            "type": "textarea",
            "required": true
          },
          {
            "label": "License",
            "description": "Select the appropriate license under which your project will be shared.",
            "type": "select",
            "required": true,
            "options": [
              "No license",
              "GNU LGPL 3.0",
              "BSD 3-Clause",
              "BSD 2-Clause",
              "GNU LGPL 2.1",
              "CC-By Attribution 4.0",
              "Artistic License 2.0",
              "CC0 1.0 Universal",
              "Apache License 2.0",
              "Mozilla Public License 2.0",
              "Academic Free License 3.0",
              "Eclipse Public License 1.0",
              "MIT License",
              "GNU GPL 3.0",
              "GNU GPL 2.0",
              "CC-By SA 4.0",
              "CC-By NC-ND 4.0"
            ]
          },
          {
            "label": "Subject",
            "description": "Select one or more subjects using the bepress taxonomy to categorize your work.",
            "type": "select-multiple",
            "required": true,
            "options": [
              "Medicine and Health Sciences",
              "Physical Sciences and Mathematics",
              "Social and Behavioral Sciences",
              "Life Sciences",
              "Engineering and Technology",
              "Business and Economics",
              "Arts and Humanities",
              "Law",
              "Architecture and Environmental Design",
              "Education",
              "Library and Information Science",
              "Other"
            ]
          }
        ]
      },
      {
        "title": "Data Collection Details",
        "fields": [
          {
            "label": "Has the data collection begun for this project?",
            "description": "Indicate whether data collection has started to avoid premature data analysis.",
            "type": "radio",
            "required": true,
            "options": [
              "No, data collection has not begun",
              "Yes, data collection is underway or complete"
            ]
          },
          {
            "label": "Have you looked at the data?",
            "description": "Confirm if you have already examined the data collected.",
            "type": "radio",
            "required": true,
            "options": ["Yes", "No"]
          },
          {
            "label": "Tags",
            "description": "Keywords that help in the identification and searchability of your project.",
            "type": "text",
            "required": false
          },
          {
            "label": "Other comments",
            "description": "Any additional information or special notes about the project.",
            "type": "textarea",
            "required": false
          }
        ]
      }
    ],
    "createdBy": "5f23ddbe37891e092791f7fb",
    "createdAt": "2024-05-28T12:34:56.789Z",
    "updatedAt": "2024-05-28T12:34:56.789Z"
  }, 
  {
    "name": "Data Use Agreement Template",
    "source": "Brainlife",
    "type": "DUA",
    "description": "A template for creating a Data Use Agreement to ensure the secure and responsible use of datasets, especially those containing sensitive or pseudonymized information.",
    "sections": [
      {
        "title": "Introduction",
        "fields": [
          {
            "label": "Dataset Name",
            "type": "text",
            "required": true,
            "description": "Enter the name of the dataset covered by this Data Use Agreement."
          }
        ]
      },
      {
        "title": "Conditions of Use",
        "fields": [
          {
            "label": "User Responsibilities",
            "type": "textarea",
            "required": true,
            "description": "Outline the responsibilities assigned to the user as the data controller.",
            "suggestions": [
              "Protect the privacy and confidentiality of the data subjects at all times",
              "Never attempt to re-identify the data subjects",
              "Never transfer this data to another user",
              "Report cases of data breach and incidental findings to the data provider"
            ]
          },
          {
            "label": "Data Provider",
            "type": "text",
            "required": true,
            "description": "Enter the name of the data provider."
          },
          {
            "label": "Citation Statement",
            "type": "textarea",
            "required": true,
            "description": "Provide a mandatory citation statement that must accompany any public use of the data.",
            "suggestions": [
              "Data provided in part by [Dataset Name] [Funder Names] This publication benefitted at least in part from the use of data or technology provided by brainlife.io (NSF BCS 1734853 to Franco Pestilli)."
            ]
          }
        ]
      },
      {
        "title": "Definitions",
        "fields": [
          {
            "label": "Data Controller",
            "type": "textarea",
            "required": false,
            "description": "Define the role of a data controller.",
            "default": "A natural or legal person, public authority, agency, or other body that, alone or jointly with others, determines the purposes and means of the processing of personal data."
          },
          {
            "label": "Data Processing",
            "type": "textarea",
            "required": false,
            "description": "Define data processing activities.",
            "default": "Any operation or set of operations performed on personal data including data download, storage, analysis, pseudonymization, anonymization, data transfer, etc."
          },
          {
            "label": "Pseudonymization",
            "type": "textarea",
            "required": false,
            "description": "Define pseudonymization.",
            "default": "The processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organizational measures to ensure that the personal data are not attributed to an identified or identifiable natural person."
          }
        ]
      }
    ],
    "createdBy": "5f23ddbe37891e092791f7fb",
    "createdAt": "2024-05-28T12:40:10.123Z",
    "updatedAt": "2024-05-28T12:40:10.123Z"
  },
  {
    "name": "NIH-NIMH Data Management Plan Template",
    "source": "NIH-NIMH",
    "type": "DMP",
    "description": "Template to aid in the creation of a comprehensive Data Management Plan, adhering to NIH and NIMH guidelines for data sharing and preservation.",
    "sections": [
      {
        "title": "Data Types and Amount",
        "fields": [
          {
            "label": "Types of Data",
            "type": "text",
            "required": true,
            "description": "Describe the types of scientific data expected to be generated in the project, including data modality, level of aggregation, and processing stage."
          },
          {
            "label": "Estimated Amount of Data",
            "type": "text",
            "required": true,
            "description": "Provide an estimate of the amount/size of scientific data expected to be collected and used in the project."
          }
        ]
      },
      {
        "title": "Data Preservation and Sharing",
        "fields": [
          {
            "label": "Data Preservation Methods",
            "type": "select",
            "required": true,
            "options": ["Backup", "Archival", "Replication"],
            "description": "Select the methods by which data will be preserved."
          },
          {
            "label": "Data Retention Period",
            "type": "text",
            "required": true,
            "description": "Specify the duration for which the data will be retained."
          },
          {
            "label": "Rationale for Data Sharing",
            "type": "textarea",
            "required": true,
            "description": "Explain the reasons for sharing the specified scientific data."
          }
        ]
      },
      {
        "title": "Metadata and Documentation",
        "fields": [
          {
            "label": "Metadata Description",
            "type": "textarea",
            "required": true,
            "description": "List and describe the metadata and other relevant data that will accompany the scientific data to aid in its interpretation."
          }
        ]
      },
      {
        "title": "Tools and Software for Data Access",
        "fields": [
          {
            "label": "Tools and Software Required",
            "type": "textarea",
            "required": true,
            "description": "Detail any specialized tools, software, or code needed to access or manipulate the shared scientific data."
          }
        ]
      },
      {
        "title": "Data Standards and Interoperability",
        "fields": [
          {
            "label": "Data Standards Used",
            "type": "textarea",
            "required": true,
            "description": "Describe the common data standards to be applied to ensure interoperability of the datasets."
          }
        ]
      },
      {
        "title": "Repository and Access",
        "fields": [
          {
            "label": "Selected Data Repository",
            "type": "text",
            "required": true,
            "description": "Name the repository where data will be archived."
          },
          {
            "label": "Access Considerations",
            "type": "textarea",
            "required": true,
            "description": "Describe the access control measures for the scientific data."
          }
        ]
      },
      {
        "title": "Compliance and Oversight",
        "fields": [
          {
            "label": "Oversight Measures",
            "type": "textarea",
            "required": true,
            "description": "Explain how compliance with the DMP will be monitored and managed within your institution."
          }
        ]
      }
    ],
    "createdBy": "5f23ddbe37891e092791f7fb",
    "createdAt": "2024-06-01T14:45:23.123Z",
    "updatedAt": "2024-06-01T14:45:23.123Z"
  }  
]
db.init(async err=>{
    templates.forEach(async (template)=>{
        new db.Templates(template).save();
    });
});