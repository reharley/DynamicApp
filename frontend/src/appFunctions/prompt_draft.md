write the implementation of initMainMenu in appFunctions/index.js

```javascript
// utils/AppState.js
export class AppState {
  setState(app, setAppState, location) {
    this.app = app;
    this.location = location;
    this.setAppState = setAppState;
  }
  constructor(app, setAppState, location) {
    this.setState(app, setAppState, location);
    this.componentInstances = {};
  }
  setComponentInstance(componentName, componentInstance) {
    this.componentInstances[componentName] = componentInstance;
  }

  getComponentInstance(componentName) {
    return this.componentInstances?.[componentName];
  }

  changeComponent(componentName, newProperties) {
    this.setAppState((prevApp) => {
      const updatedApp = { ...prevApp };
      this._updateComponent(updatedApp, componentName, newProperties);
      this._updateCustomViewComponent(
        updatedApp.customViews,
        componentName,
        newProperties
      );
      return updatedApp;
    });
  }

  _updateComponent(obj, componentName, newProperties) {
    if (obj.name === componentName) {
      obj.properties = { ...obj.properties, ...newProperties };
      return true;
    }

    if (obj.children) {
      obj.children.forEach((child) => {
        this._updateComponent(child, componentName, newProperties);
      });
    }
  }

  _updateCustomViewComponent(customViews, componentName, newProperties) {
    Object.values(customViews).forEach((view) => {
      this._updateComponent(view, componentName, newProperties);
    });
  }

  getComponent(componentName) {
    let component = this._findComponent(this.app, componentName);
    if (!component) {
      // Search in custom views
      const customViewComponent = this._findComponentInCustomViews(
        this.app.customViews,
        componentName
      );
      if (customViewComponent) {
        component = customViewComponent;
      }
    }
    component.componentInstance = this.getComponentInstance(componentName);
    if (component.type === "Form" && component.componentInstance) {
      component.formInstance = component.componentInstance;
    }
    return component;
  }
  _findComponentInCustomViews(customViews, name) {
    for (const viewKey in customViews) {
      const found = this._findComponent(customViews[viewKey], name);
      if (found) return found;
    }
    return null;
  }
  _findComponent(obj, name) {
    if (obj.name === name) return obj;
    const children = obj.children || obj.items;
    if (children) {
      for (const child of children) {
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
import React, { useState, useRef } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Card, Table, Modal } from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../data/sample_app3.json";
import { AppState } from "../utils/AppState";
import * as appFunctions from "../appFunctions";

const { Header, Content, Footer } = Layout;

let appState = null;

const RenderComponent = ({ component }) => {
  const componentRef = useRef(null);
  if (!appState || !component) return <React.Fragment />;

  const currentComponentInstance = appState.getComponentInstance(
    component.name
  );
  if (currentComponentInstance !== componentRef) {
    appState.setComponentInstance(component.name, componentRef);
    if (currentComponentInstance === undefined && component.onInit) {
      appFunctions[component.onInit](appState, component);
    }
  }
  const { type, children } = component;
  let properties = component.properties ?? {};

  const commonProps = {
    ...properties,
    ref: type !== "Form" ? componentRef : undefined,
    component,
    children:
      children &&
      children.map((child) => (
        <RenderComponent key={child.name} component={child} />
      )),
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
                appFunctions[functionName](
                  record,
                  rowIndex,
                  appState,
                  component
                );
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
      return (
        <Routes {...commonProps}>
          {children.map((child) => (
            <Route
              key={child.name}
              path={child.properties.path}
              element={<RenderComponent component={child.properties.element} />}
            />
          ))}
        </Routes>
      );
    case "CustomView":
      return (
        <RenderComponent
          component={appState.app.customViews[properties.viewName]}
        />
      );

    default:
      return null;
  }
};

const DynamicApp = () => {
  const [app, setApp] = useState(appJSON?.app);
  const location = useLocation();
  if (appState === null) appState = new AppState(app, setApp, location);
  appState.setState(app, setApp, location);
  return <RenderComponent component={app} />;
};

export default DynamicApp;
```

```javascript
// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectName) => {
  const response = await axios.get(`${baseUrl}/objects/${objectName}`);
  return response.data;
};

// Fetches all instances of a specified object type from the server.
const createObject = async (objectName, newObject) => {
  const response = await axios.post(
    `${baseUrl}/objects/${objectName}`,
    newObject
  );
  return response.data;
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (objectName, id, updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/objects/${objectName}/${id}`,
    updatedObject
  );
  return response.data;
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectName, id) => {
  const response = await axios.delete(`${baseUrl}/objects/${objectName}/${id}`);
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

export const submitObject = async (formData, appState, component) => {
  try {
    // Check if formData has an id
    if (formData.id) {
      // Update the existing project
      await objectService.updateObject(
        component.objectType,
        formData.id,
        formData
      );
    } else {
      // Create a new project
      await objectService.createObject(component.objectType, formData);
    }

    // Reload the project data to reflect changes
    await appFunctions.loadObjectData(appState, component);

    // Handle UI changes, like showing a success notification
  } catch (error) {
    console.error(`Error submitting ${component.name}:`, error);
    // Handle errors, for example, show an error notification
  }
};

export const loadObjectData = async (appState, component) => {
  try {
    const objects = await objectService.getAllObjects(component.objectType);
    console.log(component.name, objects);
    appState.changeComponent(component.name, { dataSource: objects });
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

export const populateObjectFormOnSelection = (
  record,
  rowIndex,
  appState,
  component
) => {
  console.log("Row selected:", record, rowIndex, component);
  const objectForm = appState.getComponent(component.objectFormName);
  console.log("objectForm", objectForm);
  if (objectForm && objectForm.formInstance) {
    const formattedRecord = initializeDateValuesForForm(objectForm, record);
    objectForm.formInstance.setFieldsValue(formattedRecord);
  } else {
    console.error("Object form or form instance not found");
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
const { RangePicker } = DatePicker;

const DynamicForm = ({ component, appState }) => {
  const [form] = Form.useForm();
  const currentComponentInstance = appState.getComponentInstance(
    component.name
  );
  if (currentComponentInstance !== form) {
    appState.setComponentInstance(component.name, form);
    if (currentComponentInstance === undefined && component.onInit)
      appFunctions[component.onInit](appState);
  }

  const renderFormItem = (item) => {
    // Switch statement to render form input based on type
    const formInput = (() => {
      switch (item.type) {
        case "Input":
          return <Input />;
        case "DatePicker":
          return <DatePicker />;
        case "RangePicker":
          return <RangePicker />;
        case "Select":
          return <Select {...item.properties} />;
        case "TextArea":
          return <TextArea />;
        default:
          return null;
      }
    })();

    return (
      <Form.Item {...item} key={item.name} onChange={undefined}>
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions[component.properties.onSubmit](values, appState, component)
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
