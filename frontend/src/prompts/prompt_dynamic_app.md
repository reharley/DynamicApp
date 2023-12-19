Refactor DynamicApp to have a new switch case for the new component types defined in app json. For instance, List.Item, List.Item.Meta

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
import ReactJson from "react-json-view";
import {
  Layout,
  Input,
  Tag,
  List,
  Tabs,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Card,
  Table,
  Modal,
} from "antd";

import DynamicForm from "./DynamicForm";
import appJSON from "../apps/chatbot.json";
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
      if (appFunctions[component.onInit] === undefined)
        console.log(`Function ${component.onInit} not found`);
      else appFunctions[component.onInit](appState, component);
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
        <Menu
          {...properties}
          items={component.items.map((item) => ({
            key: item.properties.key,
            label: <Link to={item.properties.link}>{item.text}</Link>,
          }))}
        />
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

    case "Text":
      return <span {...properties}>{children}</span>;

    case "List":
      return (
        <List
          {...properties}
          renderItem={(item) => (
            <List.Item>
              <RenderComponent component={item} />
            </List.Item>
          )}
        />
      );

    case "ReactJson":
      return <ReactJson {...properties} />;

    case "Tag":
      return <Tag {...properties}>{children}</Tag>;
    case "Tabs":
      return (
        <Tabs
          {...commonProps}
          items={component.items.map((item) => ({
            ...item,
            children: (
              <>
                {item.children.map((child) => {
                  console.log("child", child);
                  return <RenderComponent key={child.name} component={child} />;
                })}
              </>
            ),
          }))}
        />
      );
    case "Search":
      return (
        <Input.Search
          {...commonProps}
          onSearch={(value) => {
            if (component.onSearch && appFunctions[component.onSearch]) {
              appFunctions[component.onSearch](value, appState, component);
            } else {
              console.log(
                `Function ${component.onSearch} not found in appFunctions`
              );
            }
          }}
        />
      );
    default:
      return <React.Fragment />;
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

const baseUrl = "http://localhost:3001";

// Helper function to send requests to the /object endpoint
const sendObjectRequest = async (pluginType, action, objectName, data = {}) => {
  const response = await axios.post(`${baseUrl}/object`, {
    pluginType,
    action,
    params: { type: objectName },
    body: data,
  });
  return response.data;
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectName) => {
  return sendObjectRequest("mock", "getAllObjects", objectName);
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectName, newObject) => {
  return sendObjectRequest("mock", "createObject", objectName, newObject);
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (objectName, id, updatedObject) => {
  return sendObjectRequest("mock", "updateObject", objectName, {
    ...updatedObject,
    id,
  });
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectName, id) => {
  return sendObjectRequest("mock", "deleteObject", objectName, { id });
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
```

```javascript
// appFunctions.js
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import * as appFunctions from "../appFunctions";
import objectService from "../services/objectService";

export function updateEndDateRestriction(form, component, appState) {
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

export const submitObject = async (values, appState, component) => {
  try {
    // Check if formData has an id
    if (values.id) {
      // Update the existing project
      await objectService.updateObject(component.objectType, values.id, values);
    } else {
      // Create a new project
      await objectService.createObject(component.objectType, values);
    }

    // Reload the project data to reflect changes
    await appFunctions.loadObjectData(appState, component);

    // Handle UI changes, like showing a success notification
  } catch (error) {
    console.error(`Error submitting ${component.objectType}:`, error);
    // Handle errors, for example, show an error notification
  }
};

export const loadObjectData = async (appState, component) => {
  try {
    const objects = await objectService.getAllObjects(component.objectType);
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

export function onInitProjectForm(appState, component) {
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

/**
 * Initializes the main menu by setting the selected key based on the current route.
 * @param {AppState} appState - The state of the application.
 * @param {Component} component - The component that triggered the event.
 */
export function initMainMenu(appState, component) {
  // Retrieve the mainMenu component from the app state
  const mainMenu = appState.getComponent(component.name);
  // Check if the mainMenu component is found
  if (!mainMenu) {
    console.error("MainMenu component not found.");
    return;
  }

  // Get the current location's pathname
  const currentPath = appState.location.pathname;
  // Derive the selected key based on the current route
  const selectedKey = mainMenu.items.find(
    (item) => item.properties.link === currentPath
  )?.properties.key;

  // If a selected key is found, update the mainMenu component
  if (selectedKey) {
    appState.changeComponent(component.name, { selectedKeys: [selectedKey] });
  }
}
```

```javascript
// components/DynamicForm.jsx
import React from "react";
import { Form, InputNumber, Input, DatePicker, Button, Select } from "antd";
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
      if (appFunctions[component.onInit] === undefined)
        console.log(`Function ${component.onInit} not found`);
      else appFunctions[component.onInit](appState);
  }

  const renderFormItem = (item) => {
    // Switch statement to render form input based on type
    const formInput = (() => {
      switch (item.type) {
        case "Input":
          return <Input {...item.properties} />;
        case "DatePicker":
          return <DatePicker {...item.properties} />;
        case "RangePicker":
          return <RangePicker {...item.properties} />;
        case "Select":
          return <Select {...item.properties} />;
        case "TextArea":
          return <TextArea {...item.properties} />;
        case "InputNumber":
          return <InputNumber {...item.properties} />;
        case "Button":
          return <Button {...item.properties}>{item.properties.text}</Button>;
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
          const fieldComponent = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldComponent &&
            fieldComponent.onChange &&
            appFunctions[fieldComponent.onChange]
          ) {
            appFunctions[fieldComponent.onChange](
              form,
              fieldComponent,
              appState
            );
          }
        });
      }}
    >
      {component.items.map(renderFormItem)}
      <Form.Item>
        <Button {...component.properties.submitButton?.properties}>
          {component.properties.submitButton?.properties?.text}
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
    "name": "chatbotLayout",
    "properties": {
      "style": { "layout": "vertical" }
    },
    "children": [
      {
        "type": "Header",
        "name": "chatbotHeader",
        "properties": {},
        "children": [
          {
            "type": "Menu",
            "name": "chatbotMenu",
            "properties": {
              "theme": "dark",
              "mode": "horizontal",
              "defaultSelectedKeys": ["Chat"]
            },
            "items": [
              {
                "type": "MenuItem",
                "name": "chatbotMenuItem",
                "properties": {
                  "key": "Chat",
                  "link": "/"
                },
                "text": "Chat"
              }
            ]
          }
        ]
      },
      {
        "type": "Content",
        "name": "chatbotContent",
        "properties": {
          "style": { "padding": "24px" }
        },
        "children": [
          {
            "type": "Card",
            "name": "chatCard",
            "properties": {
              "title": "Chat with Our Bot"
            },
            "children": [
              {
                "type": "List",
                "name": "messageList",
                "properties": {
                  "itemLayout": "horizontal",
                  "dataSource": [
                    {
                      "role": "system",
                      "title": "System Message",
                      "description": "You are...",
                      "editable": false
                    },
                    {
                      "role": "user",
                      "title": "User Message",
                      "description": "Kris: Okay",
                      "editable": true
                    },
                    {
                      "role": "assistant",
                      "title": "Assistant Message",
                      "description": "Go",
                      "editable": false
                    },
                    {
                      "role": "function",
                      "title": "Function Message",
                      "description": "function_response",
                      "name": "function_name",
                      "args": "{\"name\":\"arg_name\",\"value\":\"arg_value\"}",
                      "editable": true
                    }
                  ],
                  "renderItem": {
                    "type": "CustomView",
                    "name": "messageItemView",
                    "properties": {
                      "viewName": "MessageItemView"
                    }
                  }
                }
              },
              {
                "type": "Form",
                "name": "messageForm",
                "properties": {
                  "layout": "horizontal"
                },
                "items": [
                  {
                    "type": "Input",
                    "name": "userInput",
                    "properties": {
                      "placeholder": "Type a message...",
                      "style": { "marginRight": "8px" }
                    }
                  },
                  {
                    "type": "Button",
                    "name": "sendButton",
                    "properties": {
                      "htmlType": "submit",
                      "type": "primary",
                      "text": "Send"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "Footer",
        "name": "chatbotFooter",
        "properties": {
          "text": "© 2023 Chatbot Application"
        }
      }
    ],
    "functions": {
      "onSendMessage": {
        "description": "This function is triggered when the 'Send' button is clicked. It sends the user's message to the chatbot service and retrieves the response. The function then updates the 'messageList' with both the user's message and the chatbot's response."
      }
    },
    "customViews": {
      "MessageItemView": {
        "type": "List.Item",
        "name": "messageListItem",
        "children": [
          {
            "type": "List.Item.Meta",
            "name": "messageItemMeta",
            "children": [
              {
                "type": "Avatar",
                "name": "roleAvatar",
                "bind": "role",
                "properties": {
                  "src": {
                    "function": "https://xsgames.co/randomusers/assets/avatars/pixel/42.jpg",
                    "user": "https://xsgames.co/randomusers/assets/avatars/pixel/45.jpg",
                    "assistant": "https://xsgames.co/randomusers/assets/avatars/pixel/41.jpg",
                    "system": "https://xsgames.co/randomusers/assets/avatars/pixel/21.jpg"
                  }
                }
              },
              {
                "type": "Text",
                "name": "messageContent",
                "bind": "content"
              }
            ]
          },
          {
            "type": "ReactJson",
            "name": "messageArgs",
            "bind": "args",
            "visible": "role === 'function'",
            "properties": {
              "src": {},
              "theme": "rjv-default",
              "collapsed": false,
              "enableClipboard": true,
              "displayObjectSize": true,
              "displayDataTypes": false,
              "indentWidth": 4
            }
          },
          {
            "type": "Text",
            "name": "functionName",
            "bind": "name",
            "visible": "role === 'function'"
          }
        ]
      }
    }
  }
}
```
