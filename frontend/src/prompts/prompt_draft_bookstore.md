You are an expert NodeJS full stack software engineer. You have built a full stack app that takes in the json description of a react antd application and renders it.

Catalog bookTable does not have any columns. Please populate them according to the requirements

The requirements shared by the customer is also provided below.
requirement1.json:

```json
{
  "ProjectName": "Online Bookstore App",
  "CoreFunctionality_Features": {
    "PrimaryFunctions": "Book catalog management, user account management, order processing, and recommendations.",
    "BusinessRules": "Discounts on bulk orders, user reviews and ratings, special offers for members.",
    "ExpectedOutcomes": "Efficient management of bookstore operations, enhanced user experience."
  },
  "DataHandling_Processing": {
    "DataTypes": "User data, book details, order histories, payment information.",
    "DataProcessingRequirements": "Search algorithms, payment processing, order tracking.",
    "DataUpdateFrequency": "Real-time updates for user actions, nightly updates for catalog."
  },
  "UserInteraction_Workflow": {
    "BackendUserInteraction": "Processing user orders, updating user profiles, managing wishlists.",
    "UserWorkflows": "Browse books, place orders, write reviews, manage account.",
    "RealTimeFeatures": "Live update of book availability, real-time notifications for order status."
  },
  "Scalability_Performance": {
    "UserLoad": "Designed to handle up to 10,000 concurrent users.",
    "ScalabilityRequirements": "Auto-scaling cloud services, load balancing.",
    "PerformanceGoals": "Response time under 2 seconds for user actions, 99.9% uptime."
  },
  "Security_Compliance": {
    "SecurityRequirements": "Data encryption, secure login, protection against SQL injection.",
    "SensitiveDataHandling": "Encryption for payment and personal data, secure data storage.",
    "ComplianceStandards": "Compliance with GDPR for user data, PCI DSS for payment processing."
  },
  "ErrorHandling_Logging": {
    "ErrorHandling": "Graceful handling of errors with user-friendly messages, transaction rollbacks.",
    "Logging": "Extensive logging for transactions, user activities, system errors.",
    "FailureAlerts": "Automated alerts for system failures, error reporting tools."
  }
}
```

requirement2.json:

```json
{
  "ProjectName": "Online Bookstore App",
  "UserManagementRequirements": {
    "UserRolesAndPermissions": {
      "Description": "Three user types: Administrators, Registered Users, and Guests. Administrators manage inventory and user accounts, Registered Users have access to their order history and profile, and Guests can only browse books.",
      "Roles": ["Administrator", "Registered User", "Guest"]
    },
    "AuthenticationAndAuthorization": {
      "Description": "Email/password-based authentication for registered users. Optional social media login integration. Two-factor authentication for administrators. Role-based authorization for accessing different parts of the application.",
      "Methods": [
        "Email/Password",
        "Social Media Login",
        "Two-Factor Authentication"
      ]
    },
    "UserRegistrationAndProfileManagement": {
      "RequiredInformation": ["Name", "Email", "Password", "Address"],
      "EditableProfileInformation": ["Email", "Password", "Address"]
    },
    "SecurityAndPrivacy": {
      "Description": "SSL encryption for data transmission, hashed passwords for storage. Compliance with GDPR for European users.",
      "Measures": ["SSL Encryption", "Password Hashing", "GDPR Compliance"]
    },
    "AccountRecoveryAndUserSupport": {
      "AccountRecovery": "Email-based password reset process. Security questions for account recovery.",
      "UserSupportSystem": "Ticket-based support system for account-related queries."
    },
    "ScalabilityAndPerformance": {
      "InitialUserCapacity": "Up to 10,000 users",
      "ProjectedGrowth": "Increase capacity by 50% annually",
      "ScalabilityPlan": "Cloud-based infrastructure with auto-scaling capabilities"
    },
    "IntegrationWithOtherSystems": {
      "ExistingSystemsIntegration": "CRM system for customer relationship management",
      "ThirdPartyIntegrations": [
        "CRM Integration",
        "Payment Gateway Integration"
      ]
    },
    "UserActivityTrackingAndAnalytics": {
      "TrackingNeeds": "Track user purchase history and browsing behavior",
      "ReportingRequirements": "Monthly user activity and sales reports"
    },
    "UserExperienceGoals": {
      "KeyGoals": "Intuitive navigation, personalized user dashboards, responsive design for all devices",
      "CommunicationMethods": ["Email Notifications", "In-app Messaging"]
    },
    "BudgetAndTimeConstraints": {
      "BudgetConstraints": "Limited budget for initial development",
      "DevelopmentTimeline": "6 months for the initial release"
    }
  }
}
```

requirement3.json:

```json
{
  "ProjectName": "Online Bookstore App - Data Requirements",
  "DataStructure_Modeling": {
    "DataTypes": "Text for book titles, descriptions, author names; images for book covers; numerical for prices, ratings, and inventory counts.",
    "Structure": "Relational database with tables for books, authors, users, orders, and reviews. Relationships include authors-to-books, users-to-orders, and books-to-reviews.",
    "Volume": "Start with around 10,000 book entries, expected to grow by 20% annually."
  },
  "DataSources_Collection": {
    "Sources": "User inputs for registrations and orders, publisher APIs for book details, internal systems for inventory management.",
    "CollectionMethod": "Web forms for user inputs, API integrations for external data, automated inventory updates.",
    "ValidationCleaning": "Data validation for user inputs, automated error-checking for API data, periodic manual review."
  },
  "DataStorage_Management": {
    "DatabaseSystem": "SQL-based relational database, considering PostgreSQL for its robust features and scalability.",
    "IntegrityConsistency": "ACID compliance for transactions, foreign key constraints for data integrity.",
    "HandlingLargeDataSets": "Database indexing for efficient queries, considering sharding for future scalability."
  },
  "DataSecurity_Privacy": {
    "SecurityRequirements": "Encryption for sensitive data, role-based access controls, regular security audits.",
    "PrivacyLaws": "Compliance with GDPR for European users, encryption and anonymization of personal data.",
    "SensitiveDataProtection": "Encryption of user personal and payment data, access controls to limit data exposure."
  },
  "DataAccessibility_Sharing": {
    "AccessLevels": "Different access levels for admins, employees, and users. Read-only access for third-party partners.",
    "DataSharing": "Data shared with shipping partners and book publishers, limited to necessary information.",
    "ExportImport": "Functionality for data export in CSV format, import capabilities for bulk updates from publishers."
  },
  "DataBackup_Recovery": {
    "Strategy": "Regular automated backups, offsite storage for backup copies.",
    "BackupFrequency": "Daily incremental backups, weekly full backups.",
    "DisasterRecovery": "Disaster recovery plan with a cloud-based backup solution for business continuity."
  },
  "DataAnalytics_Reporting": {
    "AnalyticsNeeds": "Sales trend analysis, user behavior analytics, inventory management reporting.",
    "ReportTypes": "Monthly sales reports, user engagement statistics, inventory level alerts.",
    "RealTimeProcessing": "Real-time data processing for inventory updates, delayed batch processing for sales reports."
  },
  "Performance_Scalability": {
    "PerformanceRequirements": "Sub-second response times for search queries, high availability during peak times.",
    "ScalingStrategy": "Cloud-based infrastructure for easy scaling, load balancing for high traffic management.",
    "LatencyThroughput": "Low latency in data retrieval, high throughput for order processing during peak sales."
  },
  "Legal_Compliance": {
    "ComplianceRequirements": "Adherence to local and international data protection laws, regular compliance audits.",
    "DataRetention": "Retention of transaction data for 7 years, user data as per GDPR guidelines.",
    "CrossBorderDataTransfer": "Compliance with data sovereignty laws, use of local data centers for specific regions."
  },
  "DataLifecycle_Management": {
    "RetentionPeriod": "User data retained as long as the account is active, book data persists indefinitely.",
    "ArchivingPurging": "Archiving of old transaction data after 7 years, purging of inactive user accounts after 5 years of inactivity.",
    "SchemaChanges": "Version-controlled schema changes, backward compatibility maintained for data migrations."
  }
}
```

project_manager_app.json:

```json
{
  "app": {
    "type": "Layout",
    "name": "mainLayout",
    "properties": {
      "style": { "layout": "vertical" }
    },
    "children": [
      {
        "type": "Header",
        "name": "mainHeader",
        "properties": {},
        "children": [
          {
            "type": "Menu",
            "name": "mainMenu",
            "properties": {
              "theme": "dark",
              "mode": "horizontal",
              "defaultSelectedKeys": ["Home"]
            },
            "items": [
              {
                "type": "MenuItem",
                "name": "menuItemHome",
                "properties": {
                  "key": "Home",
                  "link": "/"
                },
                "text": "Home"
              },
              {
                "type": "MenuItem",
                "name": "menuItemProjects",
                "properties": {
                  "key": "Projects",
                  "link": "/projects"
                },
                "text": "Projects"
              },
              {
                "type": "MenuItem",
                "name": "menuItemTeams",
                "properties": {
                  "key": "Teams",
                  "link": "/teams"
                },
                "text": "Teams"
              },
              {
                "type": "MenuItem",
                "name": "menuItemReports",
                "properties": {
                  "key": "Reports",
                  "link": "/reports"
                },
                "text": "Reports"
              }
            ]
          }
        ]
      },
      {
        "type": "Content",
        "name": "mainContent",
        "properties": {
          "style": { "padding": "24px" }
        },
        "children": [
          {
            "type": "Routes",
            "name": "mainRoutes",
            "children": [
              {
                "type": "Route",
                "name": "homeRoute",
                "properties": {
                  "path": "/",
                  "element": {
                    "type": "CustomView",
                    "name": "projectsView",
                    "properties": {
                      "viewName": "ProjectsView"
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "projectsRoute",
                "properties": {
                  "path": "/projects",
                  "element": {
                    "type": "CustomView",
                    "name": "projectsView",
                    "properties": {
                      "viewName": "ProjectsView"
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "teamsRoute",
                "properties": {
                  "path": "/teams",
                  "element": {
                    "type": "CustomView",
                    "name": "teamsView",
                    "properties": {
                      "viewName": "TeamsView"
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "reportsRoute",
                "properties": {
                  "path": "/reports",
                  "element": {
                    "type": "CustomView",
                    "name": "reportsView",
                    "properties": {
                      "viewName": "ReportsView"
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      {
        "type": "Footer",
        "name": "mainFooter",
        "properties": {
          "text": "© 2023 Project Management Dashboard"
        }
      },
      {
        "type": "Modal",
        "name": "notificationModal",
        "properties": {
          "title": "Notification",
          "content": "Your changes have been saved."
        }
      }
    ],
    "customViews": {
      "ProjectsView": {
        "type": "Row",
        "name": "mainRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "leftColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "projectCard",
                "properties": {
                  "title": "New Project Entry"
                },
                "children": [
                  {
                    "type": "Form",
                    "name": "projectForm",
                    "objectType": "Project",
                    "properties": {
                      "layout": "vertical",
                      "onSubmit": "submitObject",
                      "submitButton": {
                        "type": "Button",
                        "name": "submitProjectButton",
                        "properties": {
                          "type": "primary",
                          "htmlType": "submit",
                          "text": "Submit",
                          "name": "submitButton"
                        }
                      }
                    },
                    "items": [
                      {
                        "label": "Project ID",
                        "type": "Input",
                        "name": "id",
                        "style": { "display": "none" }
                      },
                      {
                        "label": "Project Name",
                        "type": "Input",
                        "name": "projectName",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the project name!"
                          }
                        ]
                      },
                      {
                        "label": "Start Date",
                        "type": "DatePicker",
                        "name": "startDate",
                        "onChange": "updateEndDateRestriction",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select the start date!"
                          }
                        ]
                      },
                      {
                        "label": "End Date",
                        "type": "DatePicker",
                        "name": "endDate",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select the end date!"
                          }
                        ]
                      },
                      {
                        "label": "Status",
                        "type": "Select",
                        "name": "status",
                        "properties": {
                          "options": [
                            {
                              "label": "Planning",
                              "value": "Planning"
                            },
                            {
                              "label": "Active",
                              "value": "Active"
                            },
                            {
                              "label": "Completed",
                              "value": "Completed"
                            }
                          ]
                        },
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select the status!"
                          }
                        ]
                      },
                      {
                        "label": "Description",
                        "type": "TextArea",
                        "name": "description",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the description!"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "rightColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "projectOverviewCard",
                "properties": {
                  "title": "Project Overview"
                },
                "children": [
                  {
                    "type": "Table",
                    "name": "projectOverviewTable",
                    "objectType": "Project",
                    "objectFormName": "projectForm",
                    "properties": {
                      "onRow": {
                        "click": "populateObjectFormOnSelection"
                      },
                      "columns": [
                        {
                          "title": "Name",
                          "dataIndex": "projectName",
                          "key": "name"
                        },
                        {
                          "title": "Status",
                          "dataIndex": "status",
                          "key": "status"
                        },
                        {
                          "title": "Start Date",
                          "dataIndex": "startDate",
                          "key": "startDate"
                        },
                        {
                          "title": "End Date",
                          "dataIndex": "endDate",
                          "key": "endDate"
                        }
                      ],
                      "dataSource": []
                    },
                    "onInit": "loadObjectData"
                  }
                ]
              }
            ]
          }
        ]
      },
      "TeamsView": {
        "type": "Row",
        "name": "teamRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "teamLeftColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "teamCard",
                "properties": {
                  "title": "Team Management"
                },
                "children": [
                  {
                    "type": "Form",
                    "name": "teamForm",
                    "objectType": "Team",
                    "properties": {
                      "layout": "vertical",
                      "onSubmit": "submitObject",
                      "submitButton": {
                        "type": "Button",
                        "name": "submitTeamButton",
                        "properties": {
                          "type": "primary",
                          "htmlType": "submit",
                          "text": "Create Team",
                          "name": "submitButton"
                        }
                      }
                    },
                    "items": [
                      {
                        "label": "Team ID",
                        "type": "Input",
                        "name": "id",
                        "style": { "display": "none" }
                      },
                      {
                        "label": "Team Name",
                        "type": "Input",
                        "name": "teamName",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the team name!"
                          }
                        ]
                      },
                      {
                        "label": "Team Leader",
                        "type": "Input",
                        "name": "teamLeader",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the name of the team leader!"
                          }
                        ]
                      },
                      {
                        "label": "Team Members",
                        "type": "Select",
                        "name": "teamMembers",
                        "properties": {
                          "mode": "multiple",
                          "placeholder": "Select team members",
                          "options": [
                            {
                              "label": "Member 1",
                              "value": "member1"
                            },
                            {
                              "label": "Member 2",
                              "value": "member2"
                            },
                            {
                              "label": "Member 3",
                              "value": "member3"
                            }
                          ]
                        },
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select team members!"
                          }
                        ]
                      },
                      {
                        "label": "Description",
                        "type": "TextArea",
                        "name": "description",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the description!"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "teamRightColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "teamOverviewCard",
                "properties": {
                  "title": "Teams Overview"
                },
                "children": [
                  {
                    "type": "Table",
                    "name": "teamOverviewTable",
                    "objectType": "Team",
                    "objectFormName": "teamForm",
                    "properties": {
                      "onRow": {
                        "click": "populateObjectFormOnSelection"
                      },
                      "columns": [
                        {
                          "title": "Team Name",
                          "dataIndex": "teamName",
                          "key": "teamName"
                        },
                        {
                          "title": "Team Leader",
                          "dataIndex": "teamLeader",
                          "key": "teamLeader"
                        },
                        {
                          "title": "Number of Members",
                          "dataIndex": "numberOfMembers",
                          "key": "numberOfMembers"
                        },
                        {
                          "title": "Description",
                          "dataIndex": "description",
                          "key": "description"
                        }
                      ],
                      "dataSource": []
                    },
                    "onInit": "loadObjectData"
                  }
                ]
              }
            ]
          }
        ]
      },
      "ReportsView": {
        "type": "Row",
        "name": "reportsRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "reportsLeftColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "reportCreationCard",
                "properties": {
                  "title": "Report Creation"
                },
                "children": [
                  {
                    "type": "Form",
                    "name": "reportForm",
                    "objectType": "Report",
                    "properties": {
                      "layout": "vertical",
                      "onSubmit": "submitObject",
                      "submitButton": {
                        "type": "Button",
                        "name": "submitProjectButton",
                        "properties": {
                          "type": "primary",
                          "htmlType": "submit",
                          "text": "Submit",
                          "name": "submitButton"
                        }
                      }
                    },
                    "items": [
                      {
                        "label": "Report ID",
                        "type": "Input",
                        "name": "id",
                        "style": { "display": "none" }
                      },
                      {
                        "label": "Report Name",
                        "type": "Input",
                        "name": "reportName",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please input the report name!"
                          }
                        ]
                      },
                      {
                        "label": "Date Range",
                        "type": "RangePicker",
                        "name": "dateRange",
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select the date range!"
                          }
                        ]
                      },
                      {
                        "label": "Report Type",
                        "type": "Select",
                        "name": "reportType",
                        "properties": {
                          "options": [
                            { "label": "Type 1", "value": "type1" },
                            { "label": "Type 2", "value": "type2" }
                          ]
                        },
                        "rules": [
                          {
                            "required": true,
                            "message": "Please select the report type!"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "reportsRightColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Card",
                "name": "reportsOverviewCard",
                "properties": {
                  "title": "Reports Overview"
                },
                "children": [
                  {
                    "type": "Table",
                    "name": "reportsTable",
                    "objectType": "Report",
                    "objectFormName": "reportForm",
                    "properties": {
                      "onRow": {
                        "click": "populateObjectFormOnSelection"
                      },
                      "columns": [
                        {
                          "title": "ID",
                          "dataIndex": "id",
                          "key": "id"
                        },
                        {
                          "title": "Date Range",
                          "dataIndex": "dateRange",
                          "key": "dateRange"
                        },
                        {
                          "title": "Report Type",
                          "dataIndex": "reportType",
                          "key": "reportType"
                        }
                      ],
                      "dataSource": []
                    },
                    "onInit": "loadObjectData"
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    "functions": {
      "initMainMenu": {
        "description": "This function is triggered during the initialization of the 'mainMenu' component. It sets the 'selectedKey' of the menu to match the current route if the key exists. This ensures that the correct menu item is highlighted based on the current navigation context, enhancing the user experience by providing visual feedback on the active menu item."
      },
      "loadObjectData": {
        "description": "This function is triggered when a component like a table or form is initialized. It fetches the relevant data for the specified object type (e.g., projects, teams) from the backend and updates the component's dataSource. This function ensures that the component displays the most current data as soon as it loads."
      },
      "populateObjectFormOnSelection": {
        "description": "This function is activated when a user selects an object row in the 'projectOverviewTable'. It retrieves the data from the selected row and populates the 'projectForm' fields with this information for editing. The function ensures each form field corresponds to an attribute of the selected object, enabling the user to edit object details. It includes error handling for scenarios where object data is incomplete or fails to load, providing user-friendly feedback. This function is integral for maintaining a dynamic and interactive user experience, allowing real-time editing of object data directly from the overview table."
      },
      "submitObject": {
        "description": "This function is responsible for submitting project data to the backend. It determines whether to create a new project or update an existing one based on the presence of an 'id' in the formData. If an 'id' is present, the function updates the project with the given 'id'; otherwise, it creates a new project. After successful submission or updating, the function reloads the project overview to ensure the displayed data is up-to-date. This approach maintains data integrity and ensures the user interface reflects the latest state of project data."
      },
      "updateEndDateRestriction": {
        "description": "This function is triggered when the start date changes. It should ensure the end date cannot be before the start date, clearing the end date if it is before the start date, and disabling dates before the start date for the end date."
      },
      "onInitProjectForm": {
        "description": "This function is triggered when the 'projectForm' component initializes. It generates a random Globally Unique Identifier (GUID) using the 'uuid' library and sets this GUID as the default value for the 'id' field in the form. This ensures that every new project entry starts with a unique identifier, enhancing data integrity and preventing conflicts. The function checks for the existence of the 'projectForm' and its form instance to ensure safe operation. In cases where the form or its instance is not found, an error is logged for debugging purposes. This automation streamlines the process of creating new project entries, allowing users to focus on inputting other essential project details."
      }
    },
    "navigation": {
      "type": "Breadcrumb",
      "name": "mainBreadcrumb",
      "properties": {
        "items": [
          { "name": "Home", "link": "/" },
          { "name": "Projects", "link": "/projects" }
        ]
      }
    }
  }
}
```

bookstore_app.json:

```json
{
  "app": {
    "type": "Layout",
    "name": "mainLayout",
    "properties": {
      "style": { "layout": "vertical" }
    },
    "children": [
      {
        "type": "Header",
        "name": "mainHeader",
        "properties": {},
        "children": [
          {
            "type": "Menu",
            "name": "mainMenu",
            "properties": {
              "theme": "dark",
              "mode": "horizontal",
              "defaultSelectedKeys": ["Browse"]
            },
            "items": [
              {
                "type": "MenuItem",
                "name": "browseBooks",
                "properties": {
                  "key": "Browse",
                  "link": "/browse"
                },
                "text": "Browse Books"
              },
              {
                "type": "MenuItem",
                "name": "userProfile",
                "properties": {
                  "key": "Profile",
                  "link": "/profile"
                },
                "text": "My Profile"
              },
              {
                "type": "MenuItem",
                "name": "adminPanel",
                "properties": {
                  "key": "Admin",
                  "link": "/admin"
                },
                "text": "Admin Panel"
              }
            ]
          }
        ]
      },
      {
        "type": "Content",
        "name": "mainContent",
        "properties": {
          "style": { "padding": "24px" }
        },
        "children": [
          {
            "type": "Routes",
            "name": "mainRoutes",
            "children": [
              {
                "type": "Route",
                "name": "browseRoute",
                "properties": {
                  "path": "/browse",
                  "element": {
                    "type": "CustomView",
                    "name": "bookListView",
                    "properties": {
                      "viewName": "BookListView",
                      "searchAlgorithm": "Relevance-based search with filters",
                      "realTimeAvailabilityUpdate": true
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "profileRoute",
                "properties": {
                  "path": "/profile",
                  "element": {
                    "type": "CustomView",
                    "name": "userProfileView",
                    "properties": {
                      "viewName": "UserProfileView",
                      "userWorkflow": "Manage account, write reviews, view order history"
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "adminRoute",
                "properties": {
                  "path": "/admin",
                  "element": {
                    "type": "CustomView",
                    "name": "adminPanelView",
                    "properties": {
                      "viewName": "AdminPanelView",
                      "managementFunctions": "Catalog management, order processing, user management"
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      {
        "type": "Footer",
        "name": "mainFooter",
        "properties": {
          "text": "© 2023 Online Bookstore"
        }
      }
    ],
    "customViews": {
      "BookListView": {
        "type": "Row",
        "name": "bookListRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "bookListColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Search",
                "name": "bookSearch",
                "properties": {
                  "placeholder": "Search for books",
                  "onSearch": "searchBooks"
                }
              },
              {
                "type": "Table",
                "name": "bookTable",
                "objectType": "Book",
                "properties": {
                  "columns": [
                    { "title": "Title", "dataIndex": "title", "key": "title" },
                    {
                      "title": "Author",
                      "dataIndex": "author",
                      "key": "author"
                    },
                    { "title": "Price", "dataIndex": "price", "key": "price" },
                    { "title": "ISBN", "dataIndex": "isbn", "key": "isbn" },
                    { "title": "Genre", "dataIndex": "genre", "key": "genre" },
                    {
                      "title": "Description",
                      "dataIndex": "description",
                      "key": "description"
                    }
                  ],
                  "dataSource": [],
                  "onRow": { "click": "viewBookDetails" }
                },
                "onInit": "loadBookData"
              }
            ]
          }
        ]
      },
      "UserProfileView": {
        "type": "Row",
        "name": "userProfileRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "userProfileColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Form",
                "name": "userProfileForm",
                "objectType": "UserProfile",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitUserProfile"
                },
                "items": [
                  {
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  { "label": "Name", "type": "Input", "name": "name" },
                  { "label": "Email", "type": "Input", "name": "email" },
                  { "label": "Address", "type": "Input", "name": "address" },
                  {
                    "type": "Button",
                    "name": "saveProfileButton",
                    "properties": {
                      "type": "primary",
                      "htmlType": "submit",
                      "text": "Save"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "AdminPanelView": {
        "type": "Row",
        "name": "adminPanelRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "adminPanelColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Tabs",
                "name": "adminTabs",
                "properties": {},
                "items": [
                  {
                    "key": "catalog",
                    "label": "Catalog Management",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "catalogManagementView",
                        "properties": {
                          "viewName": "CatalogManagementView"
                        }
                      }
                    ]
                  },
                  {
                    "key": "orders",
                    "label": "Order Processing",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "orderProcessingView",
                        "properties": {
                          "viewName": "OrderProcessingView"
                        }
                      }
                    ]
                  },
                  {
                    "key": "users",
                    "label": "User Management",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "userManagementView",
                        "properties": {
                          "viewName": "UserManagementView"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "CatalogManagementView": {
        "type": "Row",
        "name": "catalogManagementRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "catalogManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "bookForm",
                "objectType": "Book",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitBookForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
                    "properties": {
                      "type": "primary",
                      "htmlType": "submit",
                      "text": "Submit",
                      "name": "submitButton"
                    }
                  }
                },
                "items": [
                  {
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "Title",
                    "type": "Input",
                    "name": "title"
                  },
                  {
                    "label": "Author",
                    "type": "Input",
                    "name": "author"
                  },
                  {
                    "label": "Price",
                    "type": "Input",
                    "name": "price"
                  },
                  {
                    "label": "ISBN",
                    "type": "Input",
                    "name": "isbn"
                  },
                  {
                    "label": "Genre",
                    "type": "Select",
                    "name": "genre"
                  },
                  {
                    "label": "Cover Image URL",
                    "type": "Input",
                    "name": "coverImageUrl"
                  },
                  {
                    "label": "Description",
                    "type": "TextArea",
                    "name": "description"
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "catalogManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "bookTable",
                "objectType": "Book",
                "properties": {},
                "onInit": "loadBookData"
              }
            ]
          }
        ]
      },
      "OrderProcessingView": {
        "type": "Row",
        "name": "orderProcessingRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "orderProcessingColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "orderForm",
                "objectType": "Order",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitOrderForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
                    "properties": {
                      "type": "primary",
                      "htmlType": "submit",
                      "text": "Submit",
                      "name": "submitButton"
                    }
                  }
                },
                "items": [
                  {
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "Order ID",
                    "type": "Input",
                    "name": "orderId"
                  },
                  {
                    "label": "Book ID",
                    "type": "Input",
                    "name": "bookId"
                  },
                  {
                    "label": "User ID",
                    "type": "Input",
                    "name": "userId"
                  },
                  {
                    "label": "Quantity",
                    "type": "InputNumber",
                    "name": "quantity"
                  },
                  {
                    "label": "Order Date",
                    "type": "DatePicker",
                    "name": "orderDate"
                  },
                  {
                    "label": "Total Amount",
                    "type": "InputNumber",
                    "name": "totalAmount"
                  },
                  {
                    "label": "Status",
                    "type": "Select",
                    "name": "status",
                    "properties": {
                      "options": [
                        { "label": "Pending", "value": "Pending" },
                        { "label": "Completed", "value": "Completed" },
                        { "label": "Cancelled", "value": "Cancelled" }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "orderProcessingColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "orderTable",
                "objectType": "Order",
                "properties": {
                  "columns": [
                    {
                      "title": "Order ID",
                      "dataIndex": "orderId",
                      "key": "orderId"
                    },
                    {
                      "title": "Book ID",
                      "dataIndex": "bookId",
                      "key": "bookId"
                    },
                    {
                      "title": "User ID",
                      "dataIndex": "userId",
                      "key": "userId"
                    },
                    {
                      "title": "Quantity",
                      "dataIndex": "quantity",
                      "key": "quantity"
                    },
                    {
                      "title": "Order Date",
                      "dataIndex": "orderDate",
                      "key": "orderDate"
                    },
                    {
                      "title": "Total Amount",
                      "dataIndex": "totalAmount",
                      "key": "totalAmount"
                    },
                    {
                      "title": "Status",
                      "dataIndex": "status",
                      "key": "status"
                    }
                  ],
                  "dataSource": [],
                  "onRowClick": "viewOrderDetails"
                },
                "onInit": "loadOrderData"
              }
            ]
          }
        ]
      },
      "UserManagementView": {
        "type": "Row",
        "name": "userManagementRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "userManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "userForm",
                "objectType": "User",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitUserForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
                    "properties": {
                      "type": "primary",
                      "htmlType": "submit",
                      "text": "Submit",
                      "name": "submitButton"
                    }
                  }
                },
                "items": [
                  {
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "User ID",
                    "type": "Input",
                    "name": "userId"
                  },
                  {
                    "label": "Name",
                    "type": "Input",
                    "name": "name"
                  },
                  {
                    "label": "Email",
                    "type": "Input",
                    "name": "email"
                  },
                  {
                    "label": "Role",
                    "type": "Select",
                    "name": "role",
                    "properties": {
                      "options": [
                        { "label": "Administrator", "value": "Administrator" },
                        {
                          "label": "Registered User",
                          "value": "RegisteredUser"
                        },
                        { "label": "Guest", "value": "Guest" }
                      ]
                    }
                  },
                  {
                    "label": "Status",
                    "type": "Select",
                    "name": "status",
                    "properties": {
                      "options": [
                        { "label": "Active", "value": "Active" },
                        { "label": "Inactive", "value": "Inactive" }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "userManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "userTable",
                "objectType": "User",
                "properties": {
                  "columns": [
                    {
                      "title": "User ID",
                      "dataIndex": "userId",
                      "key": "userId"
                    },
                    { "title": "Name", "dataIndex": "name", "key": "name" },
                    { "title": "Email", "dataIndex": "email", "key": "email" },
                    { "title": "Role", "dataIndex": "role", "key": "role" },
                    {
                      "title": "Status",
                      "dataIndex": "status",
                      "key": "status"
                    }
                  ],
                  "dataSource": [],
                  "onRowClick": "viewUserDetails"
                },
                "onInit": "loadUserData"
              }
            ]
          }
        ]
      }
    }
  }
}
```
