Refactor renderComponent DynamicApp to incorporate the new changes in app json.
The changes are a new component type to add to renderComponent where Routes and Route are being used from react-router-dom for new cases.
There is also a new CustomView type to add a case for. It will render the Custom view described as one of the outermost properties off the app object.

```javascript
// utils/AppState.js
import * as appFunctions from "../appFunctions";

export class AppState {
  constructor(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
    this._initEvents(app);
    this.formInstances = {};
  }

  setFormInstance(formName, formInstance) {
    this.formInstances[formName] = formInstance;
  }

  getFormInstance(formName) {
    return this.formInstances?.[formName];
  }

  _initEvents(obj) {
    // If the object has an onInit event, call it
    if (obj.onInit && typeof appFunctions[obj.onInit] === "function") {
      if (obj.type === "Form" && this.getFormInstance(obj.name)) {
        appFunctions[obj.onInit](this);
      } else if (obj.type !== "Form") {
        appFunctions[obj.onInit](this);
      }
    }

    // Recursively call _initEvents on children
    if (obj.children) {
      obj.children.forEach((child) => this._initEvents(child));
    }
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
    const component = this._findComponent(this.app, componentName);
    if (component.type === "Form" && this.formInstances?.[componentName]) {
      component.formInstance = this.formInstances[componentName];
    }

    return component;
  }

  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    if (obj.children) {
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
import { Link } from "react-router-dom";
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
          {children &&
            children.map((item) => {
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
    default:
      return null;
  }
};

const DynamicApp = () => {
  const [app, setApp] = useState(appJSON.app);

  useEffect(() => {
    console.log("app", app);
    if (appState === null) appState = new AppState(app, setApp);
  }, []);

  return renderComponent(appState?.app);
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
// utils/AppState.js
import * as appFunctions from "../appFunctions";

export class AppState {
  constructor(app, setAppState) {
    this.app = app;
    this.setAppState = setAppState;
    this._initEvents(app);
    this.formInstances = {};
  }

  setFormInstance(formName, formInstance) {
    this.formInstances[formName] = formInstance;
  }

  getFormInstance(formName) {
    return this.formInstances?.[formName];
  }

  _initEvents(obj) {
    // If the object has an onInit event, call it
    if (obj.onInit && typeof appFunctions[obj.onInit] === "function") {
      if (obj.type === "Form" && this.getFormInstance(obj.name)) {
        appFunctions[obj.onInit](this);
      } else if (obj.type !== "Form") {
        appFunctions[obj.onInit](this);
      }
    }

    // Recursively call _initEvents on children
    if (obj.children) {
      obj.children.forEach((child) => this._initEvents(child));
    }
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
    const component = this._findComponent(this.app, componentName);
    if (component.type === "Form" && this.formInstances?.[componentName]) {
      component.formInstance = this.formInstances[componentName];
    }

    return component;
  }

  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    if (obj.children) {
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
      if (currentFormInstance === null) appState._initEvents(component);
    }
    return () => {
      appState.setFormInstance(component.name, null);
    };
  }, []);
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
          const fieldConfig = component.properties.items.find(
            (item) => item.properties.name === fieldName
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
      {component.properties.items.map((item) => {
        switch (item.type) {
          case "Input":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <Input />
              </Form.Item>
            );
          case "DatePicker":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <DatePicker />
              </Form.Item>
            );
          case "Select":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <Select>
                  {item.options.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          case "TextArea":
            return (
              <Form.Item
                key={item.properties.name}
                name={item.properties.name}
                label={item.label}
              >
                <TextArea />
              </Form.Item>
            );
          default:
            return null;
        }
      })}
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
            "children": [
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
                        "options": ["Planning", "Active", "Completed"],
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
