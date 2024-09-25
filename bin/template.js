const db = require('../api/models');

const templates = [{
    "name": "OSF-Standard Pre-Data Collection Registration Template",
    "source": "Open Science Foundation",
    "type": "Pre-Registration",
    "lifecycle":"Pre-Study",
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
    "lifecycle":"Post-Study",
    "description": "A template for creating a Data Use Agreement to ensure the secure and responsible use of datasets, especially those containing sensitive or pseudonymized information.",
    "sections": [
      {
        "title": "Data Privacy and Confidentiality",
        "fields": [
          {
            "label": "Data Controller Responsibilities",
            "type": "textarea",
            "required": true,
            "description": "Outline the responsibilities of the data controller in protecting the privacy and confidentiality of data subjects.",
            "suggestions": [
              "Implement appropriate technical and organizational measures to protect personal data.",
              "Ensure data is processed lawfully, fairly, and transparently.",
              "Limit data processing to the specified purposes outlined in this agreement."
            ]
          },
          {
            "label": "Prohibition of Re-identification",
            "type": "radio",
            "required": true,
            "description": "Acknowledge the prohibition on attempting to re-identify data subjects using any means or technology.",
            "options": [
              "I agree",
              "I do not agree"
            ]
          }
        ]
      },
      {
        "title": "Data Access and Use Conditions",
        "fields": [
          {
            "label": "Access Restrictions",
            "type": "textarea",
            "required": true,
            "description": "Specify who is allowed access to the dataset and under what conditions.",
            "suggestions": [
              "Only authorized personnel are permitted access.",
              "Access is granted solely for the purposes outlined in the agreement.",
              "Access may require completion of specific training on data privacy and security."
            ]
          },
          {
            "label": "Data Transfer Prohibition",
            "type": "radio",
            "required": true,
            "description": "Acknowledge the prohibition on transferring data to unauthorized users.",
            "options": [
              "I agree",
              "I do not agree"
            ]
          }
        ]
      },
      {
        "title": "Incident Reporting",
        "fields": [
          {
            "label": "Data Breach Reporting",
            "type": "textarea",
            "required": true,
            "description": "Outline the procedures and timeline for reporting data breaches to the data provider.",
            "suggestions": [
              "Report any suspected data breaches immediately to the data provider.",
              "Provide a detailed account of the breach, including potential risks to data subjects.",
              "Submit a formal report within 72 hours of becoming aware of the breach."
            ]
          },
          {
            "label": "Incidental Findings Reporting",
            "type": "textarea",
            "required": true,
            "description": "Detail the process for reporting any incidental findings to the data provider.",
            "suggestions": [
              "Notify the data provider of any incidental findings promptly.",
              "Include all relevant details and potential implications of the findings.",
              "Follow up with additional information as needed upon request."
            ]
          }
        ]
      },
      {
        "title": "Public Use and Attribution",
        "fields": [
          {
            "label": "Required Statement for Public Use",
            "type": "textarea",
            "required": true,
            "description": "Provide the mandatory statement that must accompany any public use of the dataset (e.g., in publications or presentations).",
            "suggestions": [
              "This research was conducted using data provided by [Dataset Name].",
              "The views expressed are those of the authors and do not necessarily reflect the official policy or position of any affiliated agencies."
            ]
          },
          {
            "label": "Funding Acknowledgment",
            "type": "textarea",
            "required": true,
            "description": "Include the required acknowledgment of funding support when using the data.",
            "suggestions": [
              "Data collection and sharing for this project was supported by [Funder Names].",
              "Funding for data provision was provided by the National Science Foundation (NSF BCS 1734853)."
            ]
          },
          {
            "label": "Citation Requirements",
            "type": "textarea",
            "required": true,
            "description": "Detail the proper citation format for the dataset when used in research or publications.",
            "suggestions": [
              "Please cite the dataset as follows: [Author Names], [Year], [Title of Dataset], [Repository or Database], [DOI or URL].",
              "Include a reference to the data provider's publication policy when citing data in your research."
            ]
          }
        ]
      },
      {
        "title": "Definitions and Terminology",
        "fields": [
          {
            "label": "Key Definitions",
            "type": "textarea",
            "required": false,
            "description": "Define key terms such as 'Data Controller', 'Data Providers', 'Data Processing', and 'Pseudonymization'.",
            "suggestions": [
              "'Data Controller': A natural or legal person, public authority, agency, or other body that determines the purposes and means of the processing of personal data.",
              "'Data Providers': Entities or individuals that supply datasets for research or analysis purposes.",
              "'Data Processing': Any operation or set of operations performed on personal data, such as collection, storage, retrieval, or dissemination.",
              "'Pseudonymization': The processing of personal data in such a way that it can no longer be attributed to a specific individual without additional information."
            ]
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
    "lifecycle":"Pre-Study",
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
  },
  {
    "name": "DATA MANAGEMENT AND SHARING PLAN",
    "source": "NIH",
    "type": "DMP",
    "lifecycle":"Pre-Study",
    "description": "Template to aid in the creation of a comprehensive Data Management Plan, adhering to NIH and NIMH guidelines for data sharing and preservation.",
    "lifecycle": "Pre-Study",
    "styles": {
      "descriptionText": "If any of the proposed research in the application involves the generation of scientific data, this application is subject to the NIH Policy for Data Management and Sharing and requires submission of a Data Management and Sharing Plan. If the proposed research in the application will generate large-scale genomic data, the Genomic Data Sharing Policy also applies and should be addressed in this Plan. Refer to the detailed instructions in the application guide for developing this plan as well as to additional guidance on sharing.nih.gov. The Plan is recommended not to exceed two pages. Text in italics should be deleted. There is no 'form page' for the Data Management and Sharing Plan. The DMS Plan may be provided in the format shown below. Public reporting burden for this collection of information is estimated to average 2 hours per response, including the time for reviewing instructions, searching existing data sources, gathering, and maintaining the data needed, and completing and reviewing the collection of information. An agency may not conduct or sponsor, and a person is not required to respond to, a collection of information unless it displays a currently valid OMB control number. Send comments regarding this burden estimate or any other aspect of this collection of information, including suggestions for reducing this burden, to: NIH, Project Clearance Branch, 6705 Rockledge Drive, MSC 7974, Bethesda, MD 20892-7974, ATTN: PRA (0925-0001 and 0925-0002). Do not return the completed form to this address.",
      "header": {
        "text": "07/2022 Approved Through 01/31/2026",
        "direction": "right"
      }
    },
    "sections": [
      {
        "title": "Element 1: Data Type",
        "fields": [
          {
            "label": "A. Types and Amount of Scientific Data",
            "type": "textarea",
            "required": true,
            "description": "Summarize the types and estimated amount of scientific data expected to be generated in the project."
          },
          {
            "label": "B. Scientific Data to be Preserved and Shared",
            "type": "textarea",
            "required": true,
            "description": "Describe which scientific data from the project will be preserved and shared and provide the rationale for this decision."
          },
          {
            "label": "C. Metadata, Other Relevant Data, and Documentation",
            "type": "textarea",
            "required": true,
            "description": "Briefly list the metadata, other relevant data, and any associated documentation that will be made accessible to facilitate interpretation of the scientific data."
          }
        ]
      },
      {
        "title": "Element 2: Related Tools, Software and/or Code",
        "description": "State whether specialized tools, software, and/or code are needed to access or manipulate shared scientific data, and if so, provide the names and how they can be accessed.",
        "fields": [
          {
            "type": "textarea",
            "required": true,
            "description": "State whether specialized tools, software, and/or code are needed to access or manipulate shared scientific data, and if so, provide the names and how they can be accessed."
          }
        ]
      },
      {
        "title": "Element 3: Standards",
        "fields": [
          {
            "type": "textarea",
            "required": true,
            "description": "State the common data standards to be applied to the scientific data and associated metadata to enable interoperability of datasets and resources. Describe how these standards will be applied."
          }
        ]
      },
      {
        "title": "Element 4: Data Preservation, Access, and Associated Timelines",
        "fields": [
          {
            "label": "A. Repository for Data and Metadata",
            "type": "textarea",
            "required": true,
            "description": "Provide the name of the repository(ies) where scientific data and metadata arising from the project will be archived."
          },
          {
            "label": "B. Data Accessibility and Identification",
            "type": "textarea",
            "required": true,
            "description": "Describe how the scientific data will be findable and identifiable, such as via a persistent unique identifier or other standard indexing tools."
          },
          {
            "label": "C. Data Availability Timeline",
            "type": "textarea",
            "required": true,
            "description": "Describe when the scientific data will be made available to other users and for how long."
          }
        ]
      },
      {
        "title": "Element 5: Access, Distribution, or Reuse Considerations",
        "fields": [
          {
            "label": "A. Factors Affecting Access, Distribution, or Reuse",
            "type": "textarea",
            "required": true,
            "description": "Describe and justify any applicable factors or data use limitations affecting subsequent access, distribution, or reuse of scientific data."
          },
          {
            "label": "B. Controlled Access to Data",
            "type": "textarea",
            "required": true,
            "description": "State whether access to the scientific data will be controlled and describe the control mechanisms."
          },
          {
            "label": "C. Protections for Privacy, Rights, and Confidentiality",
            "type": "textarea",
            "required": true,
            "description": "Describe how the privacy, rights, and confidentiality of human research participants will be protected."
          }
        ]
      },
      {
        "title": "Element 6: Oversight of Data Management and Sharing",
        "fields": [
          {
            "type": "textarea",
            "required": true,
            "description": "Describe how compliance with this Plan will be monitored and managed, including the frequency of oversight and the responsible parties at your institution."
          }
        ]
      }
    ],
    "createdBy": "5f23ddbe37891e092791f7fb",
    "createdAt": "2024-06-01T14:45:23.123Z",
    "updatedAt": "2024-06-01T14:45:23.123Z"
  },  
  {
    "name": "fMRI Study Pre-Registration Template",
    "source": "PsychArchives",
    "type": "Pre-Registration",
    "lifecycle":"Pre-Study",
    "description": "A comprehensive template to guide the pre-registration process of fMRI studies, ensuring all necessary documentation and methodological details are captured.The goal of this template is to provide sufficient information in pre-registration of fMRI studies to increase reproducibility. It is based on the OSF pre-registration template and a first pre-registration template for fMRI created by Jessica Flannery. Many people contributed to this template with their ideas during hackathons, and aimed to make it as concise and informative as possible.",
    "sections": [
        {
            "title": "Study Information",
            "fields": [
                {
                    "label": "Working Title",
                    "description": "A specific and informative description of your planned study.",
                    "type": "text",
                    "required": true
                },
                {
                    "label": "Authors",
                    "description": "List the authors involved in the study, with optional details on authorship order and contributions.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Description",
                    "description": "Provide a brief introduction, background, purpose, and aims of the study.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Hypotheses",
                    "description": "List each hypothesis you want to test, with details on directional or non-directional relationships.",
                    "type": "textarea",
                    "required": true
                }
            ]
        },
        {
            "title": "Design Plan",
            "fields": [
                {
                    "label": "Study Type",
                    "description": "Specify if the study is an experiment, observational study, or other.",
                    "type": "radio",
                    "required": true,
                    "options": [
                        "Experiment",
                        "Observational study",
                        "Other"
                    ]
                },
                {
                    "label": "Study Design",
                    "description": "Describe the study design (e.g., between-subjects, within-subjects, mixed design).",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Experimental Design",
                    "description": "Detail the experimental design of the tasks performed in the scanner.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Blinding",
                    "description": "Describe who is aware of the experimental manipulations within the study.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Randomization",
                    "description": "Detail any form of randomization used in the study, including the mechanism implemented.",
                    "type": "textarea",
                    "required": true
                }
            ]
        },
        {
            "title": "Sampling Plan",
            "fields": [
                {
                    "label": "Details of Larger Project",
                    "description": "Indicate if this study is part of a larger project, with a brief description if applicable.",
                    "type": "radio",
                    "required": true,
                    "options": [
                        "No",
                        "Yes"
                    ]
                },
                {
                    "label": "Existing Data",
                    "description": "Specify the status of data used in the study, such as whether data collection has begun or if existing data will be used.",
                    "type": "radio",
                    "required": true,
                    "options": [
                        "Registration prior to creation of data",
                        "Registration prior to accessing the data",
                        "Registration prior to any human observation of the data",
                        "Registration prior to analysis of the data",
                        "Registration following analysis of the data"
                    ]
                },
                {
                    "label": "Data Collection",
                    "description": "Detail the data collection process including sample description, behavioral, and fMRI data acquisition steps.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Sample Size",
                    "description": "State your target sample size, stopping rule, and justify your choices.",
                    "type": "textarea",
                    "required": true
                }
            ]
        },
        {
            "title": "Variables",
            "fields": [
                {
                    "label": "Manipulated Variables",
                    "description": "Describe all variables you plan to manipulate, including their levels or treatment arms.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Measured Variables",
                    "description": "Describe each variable measured, indicating the corresponding confirmatory hypothesis.",
                    "type": "textarea",
                    "required": true
                }
            ]
        },
        {
            "title": "Analysis Plan",
            "fields": [
                {
                    "label": "Statistical Modeling",
                    "description": "Specify all confirmatory analyses planned, including the type of model, variables involved, and software used.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Follow-up Analyses",
                    "description": "Detail any planned confirmatory analyses for following up on effects in your statistical model.",
                    "type": "textarea",
                    "required": true
                },
                {
                    "label": "Exploratory Analyses",
                    "description": "Describe any exploratory tests planned to investigate unexpected differences or relationships.",
                    "type": "textarea",
                    "required": true
                }
            ]
        }
    ],
    "createdBy": "5f23ddbe37891e092791f7fb",
    "createdAt": "2024-08-10T12:34:56.789Z",
    "updatedAt": "2024-08-10T12:34:56.789Z"
},
{
  "name": "Ultimate Consent Form - GDPR Edition",
  "type": "Consent Form",
  "lifecycle": "During-Study",
  "source": "Open Brain Consent OBC-GDPR-ULT 1.1.0",
  "description": "The current version of the ultimate consent form (GDPR edition) contains GDPR-specific wording related to the privacy implications of processing and sharing participants' data. It ensures compliance with GDPR while informing participants of their rights and the intended use of their data.",
  "sections": [
    {
      "title": "Usage and Storage of Your Data",
      "fields": [
        {
          "label": "Usage and Storage of Your Data",
          "description": "Details the purposes for which your data will be used and stored, both for the current study and potentially for future research in medical and cognitive neuroscience.",
          "suggestions": [
            "This includes data from your brain scans, test results, family and medical history, gender, and age."
          ],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Consent for Usage",
          "description": "Confirms your agreement to allow your data to be used for research purposes.",
          "suggestions": [
            "By agreeing to participate, you are making a valuable contribution to research that could benefit others. Note: If any commercial products result from this research, you will not receive any part of the profits."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Confidentiality of Your Data",
      "fields": [
        {
          "label": "Confidentiality Measures",
          "description": "Explains the measures taken to ensure your data remains confidential and cannot be easily traced back to you.",
          "suggestions": [
            "Your data will be anonymized, and identifiable facial features in brain scans may be removed to protect your identity."
          ],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Data Traceability",
          "description": "Outlines how your data is stored and the limited conditions under which it could potentially be traced back to you.",
          "suggestions": [],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Data Privacy Impact Assessment",
          "description": "Describes the risk assessment conducted to ensure the protection of your data.",
          "suggestions": [
            "The risks of accessing data from our servers have been assessed and are considered low. For more details, see the Data Privacy Impact Assessment at your institution."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Access to Your Data for Verification",
      "fields": [
        {
          "label": "Data Access for Verification",
          "description": "Explains who can access your data for verification purposes and why this is necessary.",
          "suggestions": [],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Persons with Access",
          "description": "Lists the specific individuals and organizations that may have access to your data.",
          "suggestions": [
            "Access may be granted to the local safety committee, the data controller working for the study’s primary investigator, and relevant local, national, and international authorities. They are required to keep your data confidential."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Retention Period of Your Data",
      "fields": [
        {
          "label": "Data Retention",
          "description": "Details how long your data will be retained and the criteria for its re-evaluation.",
          "suggestions": [
            "Your data may be kept indefinitely for legitimate research interests. However, we will re-evaluate the need to retain it every few years."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Withdrawing Consent",
      "fields": [
        {
          "label": "Consent Withdrawal",
          "description": "Explains your right to withdraw consent for the use of your data and the implications of doing so.",
          "suggestions": [],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Passing on to Countries Outside the European Union (EU)",
      "fields": [
        {
          "label": "Data Transfer Outside the EU",
          "description": "Describes the potential for your data to be transferred to non-EU countries and the protection measures in place.",
          "suggestions": [
            "Your encoded data might be accessed by non-EU based scientists for research verification. While EU data protection rules won't apply in those countries, your privacy will be safeguarded through a Data User Agreement."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "More Information About Your Rights Regarding Processing of the Data",
      "fields": [
        {
          "label": "General Information",
          "description": "Provides information on where to learn more about your data processing rights.",
          "suggestions": [
            "For general information about your rights regarding the processing of your personal data, consult the website of the relevant Data Protection Authority at your institution."
          ],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Contact for Rights",
          "description": "Identifies who to contact for questions about your rights concerning the processing of your data.",
          "suggestions": [
            "If you have any questions about your rights, please contact the person responsible for processing your data in this study. Contact details can be found in the Appendix."
          ],
          "type": "textarea",
          "required": true
        },
        {
          "label": "Complaints",
          "description": "Explains the process for raising complaints regarding the processing of your data.",
          "suggestions": [
            "If you have concerns about how your data is being processed, we recommend contacting the research location first. You can also reach out to the Data Protection Officer or the relevant Data Protection Authority."
          ],
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "title": "Signatures",
      "fields": [
        {
          "label": "Date",
          "description": "The date when you sign the consent form.",
          "suggestions": [],
          "type": "text",
          "required": true
        },
        {
          "label": "Collected by",
          "description": "The name of the person who collects your consent.",
          "suggestions": [],
          "type": "text",
          "required": true
        },
        {
          "label": "Signature",
          "description": "Your signature, indicating your consent.",
          "suggestions": [],
          "type": "text",
          "required": true
        }
      ]
    }
  ]
}
]

db.init(async err=>{
    templates.forEach(async (template)=>{
        new db.Templates(template).save();
    });
});