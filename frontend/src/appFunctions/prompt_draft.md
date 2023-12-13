Refactor renderComponent into a functional component so that it can call the onInit function of that component. An example of this is DynamicForm where is sets the form instance and runs the initialization event.

When refactoring, rename getFormInstance and setFormInstance into getComponentInstance and setComponentInstance and reuse those functions for RenderComponent

```javascript
// utils/AppState.js
export class AppState {
  constructor(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
    this.formInstances = {};
  }

  setFormInstance(formName, formInstance) {
    this.formInstances[formName] = formInstance;
  }

  getFormInstance(formName) {
    return this.formInstances?.[formName];
  }

  changeComponent(componentName, newProperties) {
    this.setAppState((prevApp) => {
      const updatedApp = { ...prevApp };
      this._updateComponent(updatedApp, componentName, newProperties);
      return updatedApp;
    });
  }

  _updateComponent(obj, componentName, newProperties) {
    if (obj.name === componentName) {
      obj.properties = { ...obj.properties, ...newProperties };
      return;
    }

    if (obj.children) {
      obj.children.forEach((child) => {
        this._updateComponent(child, componentName, newProperties);
      });
    }
  }

  getComponent(componentName) {
    let component = this._findComponent(this.app, componentName);

    // Check in customViews if not found in regular structure
    if (!component && this.app.customViews) {
      component = this._findComponent(this.app.customViews, componentName);
    }

    if (
      component &&
      component.type === "Form" &&
      this.formInstances?.[componentName]
    ) {
      component.formInstance = this.formInstances[componentName];
    }

    return component;
  }

  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    const children = obj.children || obj.items;
    if (children) {
      for (const child of obj.children) {
        const found = this._findComponent(child, name);
        if (found) return found;
      }
    }
    return null;
  }
}
```

```javascript
// components/DynamicApp.js
import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../data/sample_app3.json";
import { AppState } from "../utils/AppState";
import * as appFunctions from "../appFunctions";

const { Header, Content, Footer } = Layout;

let appState = null;

const renderComponent = (component) => {
  if (!appState || !component) return <React.Fragment />;
  const { type, children } = component;
  let properties = component.properties ?? {};

  const commonProps = {
    ...properties,
    component,
    children: children && children.map((child) => renderComponent(child)),
  };

  switch (type) {
    case "Layout":
      return <Layout {...commonProps} />;
    case "Header":
      return <Header {...commonProps} />;
    case "Content":
      return <Content {...commonProps} />;
    case "Row":
      return <Row {...commonProps} />;
    case "Col":
      return <Col {...commonProps} />;
    case "Menu":
      return (
        <Menu {...properties}>
          {component.items &&
            component.items.map((item) => {
              if (item.type === "MenuItem") {
                return (
                  <Menu.Item key={item.properties.key}>
                    <Link to={item.properties.link}>{item.text}</Link>
                  </Menu.Item>
                );
              }
              return null;
            })}
        </Menu>
      );
    case "Card":
      return <Card {...commonProps} />;
    case "Form":
      return <DynamicForm {...commonProps} appState={appState} />;
    case "Table":
      const onRow = (record, rowIndex) => {
        return {
          onClick: () => {
            if (
              component.properties.onRow &&
              component.properties.onRow.click
            ) {
              const functionName = component.properties.onRow.click;
              if (appFunctions[functionName]) {
                appFunctions[functionName](record, rowIndex, appState);
              }
            }
          },
        };
      };
      return <Table {...commonProps} onRow={onRow} />;
    case "Footer":
      return <Footer {...commonProps} />;
    case "Modal":
      return <Modal {...commonProps} />;
    case "Breadcrumb":
      return (
        <Breadcrumb {...commonProps}>
          {properties.items.map((item) => (
            <Breadcrumb.Item key={item.name} href={item.link}>
              {item.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      );

    case "Routes":
      return <Routes>{children.map((child) => renderComponent(child))}</Routes>;

    case "Route":
      return (
        <Route
          path={properties.path}
          element={renderComponent(properties.element)}
        />
      );
    case "CustomView":
      return renderComponent(appState.app.customViews[properties.viewName]);

    default:
      return null;
  }
};

const DynamicApp = () => {
  const [app, setApp] = useState(appJSON?.app);
  if (appState === null) appState = new AppState(app, setApp);
  return renderComponent(app);
};

export default DynamicApp;
```

```javascript
// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getAllObjects = async () => {
  const response = await axios.get(`${baseUrl}/objects`);
  return response.data;
};

const createObject = async (newObject) => {
  const response = await axios.post(`${baseUrl}/objects`, newObject);
  return response.data;
};

const updateObject = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/objects/${id}`, updatedObject);
  return response.data;
};

const deleteObject = async (id) => {
  const response = await axios.delete(`${baseUrl}/objects/${id}`);
  return response.data;
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
```

```javascript
// appFunctions/index.js
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import * as appFunctions from "../appFunctions";
import objectService from "../services/objectService";

export function updateEndDateRestriction(form, fieldConfig, appState) {
  const startDate = form.getFieldValue("startDate");
  const endDate = form.getFieldValue("endDate");

  // Clear the end date if it is before the start date
  if (startDate && endDate && startDate.isAfter(endDate)) {
    form.setFields([
      {
        name: "endDate",
        value: null,
      },
    ]);
  }

  // Disable dates before the start date for the end date
  const disableEndDate = (current) => {
    return current && current.isBefore(startDate, "day");
  };

  // Update the 'disabledDate' property for the 'endDate' field
  form.setFields([
    {
      name: "endDate",
      disabledDate: disableEndDate,
    },
  ]);
}

export const submitObject = async (formData, appState) => {
  try {
    // Check if formData has an id
    if (formData.id) {
      // Update the existing project
      await objectService.updateObject(formData.id, formData);
    } else {
      // Create a new project
      await objectService.createObject(formData);
    }

    // Reload the project data to reflect changes
    await appFunctions.loadProjectData(appState);

    // Handle UI changes, like showing a success notification
  } catch (error) {
    console.error("Error submitting project:", error);
    // Handle errors, for example, show an error notification
  }
};

export const loadProjectData = async (appState) => {
  try {
    console.log("loadProjectData");
    const projects = await objectService.getAllObjects();
    appState.changeComponent("projectOverviewTable", {
      properties: { options: projects },
    });
  } catch (error) {
    console.error("Error loading project data:", error);
    // Handle errors (e.g., show error message)
  }
};

export function initializeDateValuesForForm(form, record) {
  const newRecord = { ...record };
  const formItems = form.items;

  formItems.forEach((item) => {
    if (item.type === "DatePicker") {
      const fieldName = item.name;
      if (newRecord[fieldName]) {
        newRecord[fieldName] = dayjs(newRecord[fieldName]);
      }
    }
  });

  return newRecord;
}

export const populateProjectFormOnSelection = (record, rowIndex, appState) => {
  console.log("Row selected:", record, rowIndex);
  const projectForm = appState.getComponent("projectForm");

  if (projectForm && projectForm.formInstance) {
    const formattedRecord = initializeDateValuesForForm(projectForm, record);
    projectForm.formInstance.setFieldsValue(formattedRecord);
  } else {
    console.error("Project form or form instance not found");
  }
};

export function onInitProjectForm(appState) {
  console.log("onInitProjectForm");
  const projectForm = appState.getComponent("projectForm");

  if (projectForm && projectForm.formInstance) {
    const randomGuid = uuidv4();
    projectForm.formInstance.setFieldsValue({
      id: randomGuid,
    });
  } else {
    console.error("Project form or form instance not found");
  }
}
```

```javascript
// components/DynamicForm.jsx
import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";

const { Option } = Select;
const { TextArea } = Input;

const DynamicForm = ({ component, appState }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const currentFormInstance = appState.getFormInstance(component.name);
    if (currentFormInstance !== form) {
      appState.setFormInstance(component.name, form);
      // Initialize events after the form instance is set
      if (currentFormInstance === null && component.onInit)
        appFunctions[component.onInit](appState);
    }
    return () => {
      appState.setFormInstance(component.name, null);
    };
  }, []);

  const renderFormItem = (item) => {
    // Switch statement to render form input based on type
    const formInput = (() => {
      switch (item.type) {
        case "Input":
          return <Input />;
        case "DatePicker":
          return <DatePicker />;
        case "Select":
          return <Select {...item.properties} />;
        case "TextArea":
          return <TextArea />;
        default:
          return null;
      }
    })();

    return (
      <Form.Item {...item} key={item.name}>
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions[component.properties.onSubmit](values, appState)
      }
      onFieldsChange={(changedFields, allFields) => {
        changedFields.forEach((field) => {
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldConfig = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldConfig &&
            fieldConfig.onChange &&
            appFunctions[fieldConfig.onChange]
          ) {
            appFunctions[fieldConfig.onChange](form, fieldConfig, appState);
          }
        });
      }}
    >
      {component.items.map(renderFormItem)}
      <Form.Item>
        <Button {...component.properties.submitButton.properties}>
          {component.properties.submitButton.properties.text}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
```

app json:

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
                    ],
                    "functions": {
                      "submitObject": {
                        "description": "This function is responsible for submitting project data to the backend. It determines whether to create a new project or update an existing one based on the presence of an 'id' in the formData. If an 'id' is present, the function updates the project with the given 'id'; otherwise, it creates a new project. After successful submission or updating, the function reloads the project overview to ensure the displayed data is up-to-date. This approach maintains data integrity and ensures the user interface reflects the latest state of project data."
                      },
                      "updateEndDateRestriction": {
                        "description": "This function is triggered when the start date changes. It should ensure the end date cannot be before the start date, clearing the end date if it is before the start date, and disabling dates before the start date for the end date."
                      },
                      "onInitProjectForm": {
                        "description": "This function is triggered when the 'projectForm' component initializes. It generates a random Globally Unique Identifier (GUID) using the 'uuid' library and sets this GUID as the default value for the 'id' field in the form. This ensures that every new project entry starts with a unique identifier, enhancing data integrity and preventing conflicts. The function checks for the existence of the 'projectForm' and its form instance to ensure safe operation. In cases where the form or its instance is not found, an error is logged for debugging purposes. This automation streamlines the process of creating new project entries, allowing users to focus on inputting other essential project details."
                      }
                    }
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
                    "properties": {
                      "onRow": {
                        "click": "populateProjectFormOnSelection"
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
                    "onInit": "loadProjectData",
                    "functions": {
                      "loadProjectData": {
                        "description": "This function is called when the Project Overview table is initialized. It should fetch all project data from the backend using an API call, and then set this data as the dataSource for the table. The function must handle any errors during the fetch operation and provide appropriate fallbacks or error messages. This function will ensure that the table is populated with up-to-date project information as soon as the component loads."
                      },
                      "populateProjectFormOnSelection": {
                        "description": "This function is activated when a user selects a project row in the 'projectOverviewTable'. It retrieves the data from the selected row and populates the 'projectForm' fields with this information for editing. The function ensures each form field corresponds to an attribute of the selected project, enabling the user to edit project details. It includes error handling for scenarios where project data is incomplete or fails to load, providing user-friendly feedback. This function is integral for maintaining a dynamic and interactive user experience, allowing real-time editing of project data directly from the overview table."
                      }
                    }
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
                    "properties": {
                      "layout": "vertical",
                      "onSubmit": "submitTeamData",
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
                    ],
                    "functions": {
                      "submitTeamData": {
                        "description": "This function handles the submission of new team data to the backend."
                      }
                    }
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
                    "properties": {
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
                    "onInit": "loadTeamData",
                    "functions": {
                      "loadTeamData": {
                        "description": "Function to load team data into the table."
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
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
