onInitMessageListItem should set the role to listItemTitle, and hide messageArgs if not a function role.

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
    this.customViewCache = {}; // New cache to store custom view instances
  }

  getComponent(name) {
    // First, search in the main app structure
    let foundComponent = this._searchComponentByName(name, this.app);

    // If not found in the main app, search in the customViewCache
    if (!foundComponent) {
      Object.values(this.customViewCache).forEach((cacheItem) => {
        const componentInCache = this._searchComponentByName(name, cacheItem);
        if (componentInCache) {
          foundComponent = componentInCache;
          return;
        }
      });
    }

    return foundComponent;
  }
  _searchComponentByName(name, currentComponent) {
    if (!currentComponent || typeof currentComponent !== "object") return null;

    // Base case: if the component's name matches, return the component
    if (currentComponent.name === name) {
      return currentComponent;
    }

    // Recursive case: iterate over all properties
    for (const key in currentComponent) {
      const prop = currentComponent[key];

      // If the property is an object or an array, search recursively
      if (prop && typeof prop === "object") {
        let foundComponent;

        if (Array.isArray(prop)) {
          for (const item of prop) {
            foundComponent = this._searchComponentByName(name, item);
            if (foundComponent) return foundComponent;
          }
        } else {
          foundComponent = this._searchComponentByName(name, prop);
          if (foundComponent) return foundComponent;
        }
      }
    }

    return null;
  }
  /**
   * Updates a component's properties by name.
   * @param {string} componentName - The name of the component to update.
   * @param {object} newProperties - The new properties to set on the component.
   */
  changeComponent(componentName, newProperties) {
    const component = this.getComponent(componentName);
    if (component) {
      // Update the component's properties
      component.properties = { ...component.properties, ...newProperties };

      // Optionally, you can trigger a state update or any other necessary updates
      this.setAppState({ ...this.app }); // if setAppState is a method to trigger React state update

      return true;
    } else {
      console.error(`Component "${componentName}" not found in AppState.`);
      return false;
    }
  }

  getCustomViewWithItemData(customViewName, dataItem, index) {
    // Generate a unique cache key for the custom view instance
    const cacheKey = `${customViewName}_${index}`;
    // Check if the custom view instance is already in the cache
    if (this.customViewCache[cacheKey]) {
      return this.customViewCache[cacheKey];
    }

    const customViewTemplate = this.app.customViews[customViewName];
    if (!customViewTemplate) {
      console.error(`Custom view "${customViewName}" not found.`);
      return null;
    }

    const customViewClone = structuredClone(customViewTemplate);

    // Attach the dataItem and update names with index
    customViewClone.properties = {
      ...customViewClone.properties,
      dataItem: dataItem,
      dataIndex: index,
    };

    this._appendIndexToNames(customViewClone, index);

    // Store the new custom view instance in the cache
    this.customViewCache[cacheKey] = customViewClone;

    return customViewClone;
  }

  /**
   * Appends an index to the names of all components.
   * @param {object} component - The component or sub-component to process.
   * @param {number|string} index - The index to append.
   */
  _appendIndexToNames(component, index) {
    // Check if the component is valid and has 'name' and 'type' properties
    if (component && typeof component === "object") {
      if (component.name && component.type) component.name += `_${index}`;

      // Iterate over all properties for nested objects or arrays
      for (const key in component) {
        const prop = component[key];
        if (prop && typeof prop === "object") {
          if (Array.isArray(prop)) {
            prop.forEach((item) => this._appendIndexToNames(item, index));
          } else {
            this._appendIndexToNames(prop, index);
          }
        }
      }
    }
  }
}
```

```javascript
// components/DynamicApp.js
import React, { useState, useRef } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import ReactJson from "react-json-view";
import {
  Avatar,
  Layout,
  Input,
  Tag,
  List,
  Tabs,
  Menu,
  Typography,
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
const { Text } = Typography;
let appState = null;

const RenderComponent = ({ component }) => {
  const componentRef = useRef(null);
  if (!appState || !component) return <React.Fragment />;
  component.current = componentRef.current;
  if (componentRef.current === null && component.onInit) {
    if (appFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions[component.onInit](appState, component);
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
    case "Avatar":
      return <Avatar {...component.properties} />;

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
      return <Text {...properties}>{properties.text}</Text>;

    case "List":
      return (
        <List
          {...properties}
          renderItem={(item, index) => {
            // Retrieve and interpolate CustomView using its name
            const customViewClone = appState.getCustomViewWithItemData(
              component.properties.renderItem.properties.viewName,
              item,
              index
            );

            return (
              <List.Item>
                {customViewClone && (
                  <RenderComponent component={customViewClone} />
                )}
              </List.Item>
            );
          }}
        />
      );

    case "List.Item":
      return (
        <List.Item {...commonProps}>
          {children.map((child) => (
            <RenderComponent key={child.name} component={child} />
          ))}
        </List.Item>
      );

    case "List.Item.Meta":
      console.log("List.Item.Meta", commonProps);
      return (
        <List.Item.Meta
          avatar={
            properties.avatar && (
              <RenderComponent component={properties.avatar} />
            )
          }
          title={
            properties.title && <RenderComponent component={properties.title} />
          }
          description={
            properties.description && (
              <RenderComponent component={properties.description} />
            )
          }
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

const baseUrl = "http://localhost:3001/api";

// Helper function to send requests to the /object endpoint
const sendObjectRequest = async (pluginType, action, objectName, data = {}) => {
  const response = await axios.post(`${baseUrl}/objects`, {
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
// components/DynamicForm.jsx
import React from "react";
import { Form, InputNumber, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";

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
    </Form>
  );
};

export default DynamicForm;
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
 * Initializes a message list item with data from the message list's dataSource.
 * @param {AppState} appState - The state of the application.
 * @param {Component} component - The messageListItem component to initialize.
 */
export function onInitMessageListItem(appState, component) {
  const dataItem = component.properties.dataItem;
  const dataIndex = component.properties.dataIndex;

  if (!dataItem) {
    console.error("Data item not found for message list item initialization.");
    return;
  }

  // Adjust component names based on dataIndex
  const adjustedName = (baseName) => `${baseName}_${dataIndex}`;

  // Retrieve the avatar sources from listItemAvatar
  const listItemAvatar = appState.getComponent(adjustedName("listItemAvatar"));
  const avatarSrcs = listItemAvatar ? listItemAvatar.properties.srcs : {};

  // Determine the correct avatar source based on the role
  const avatarSrc = avatarSrcs[dataItem.role] || "";

  // Update Avatar component
  const avatarName = adjustedName("listItemAvatar");
  appState.changeComponent(avatarName, { src: avatarSrc });

  // Update Message Content
  const messageContentName = adjustedName("messageContent");
  appState.changeComponent(messageContentName, {
    text: dataItem.content,
  });

  // Handle additional arguments for function type messages
  if (dataItem.role === "function" && dataItem.args) {
    const messageArgsName = adjustedName("messageArgs");
    appState.changeComponent(messageArgsName, { src: dataItem.args });
  }
}
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
                      "content": "You are...",
                      "editable": false
                    },
                    {
                      "role": "user",
                      "content": "Kris: Okay",
                      "editable": true
                    },
                    {
                      "role": "assistant",
                      "content": "Go",
                      "editable": false
                    },
                    {
                      "role": "function",
                      "content": "function_response",
                      "name": "awesomeFunction",
                      "args": { "name": "arg_name", "value": "arg_value" },
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
                "type": "Search",
                "name": "messageInput",
                "properties": {
                  "placeholder": "Send message to chatbot",
                  "onSearch": "onSendMessage"
                }
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
      },
      "onInitMessageListItem": {
        "description": "The onInitMessageListItem function dynamically initializes each messageListItem component in the chat interface. It takes data from the dataItem of the message list's dataSource, setting properties like avatar and message content. This function is essential for rendering the chat flow, as it adapts the display of messages based on their type and sender, ensuring a responsive and user-friendly chat experience."
      }
    },
    "customViews": {
      "MessageItemView": {
        "type": "List.Item",
        "name": "messageListItem",
        "properties": {
          "dataIndex": -1,
          "dataItem": {}
        },
        "onInit": "onInitMessageListItem",
        "children": [
          {
            "type": "List.Item.Meta",
            "name": "listItemMeta",
            "properties": {
              "avatar": {
                "type": "Avatar",
                "name": "listItemAvatar",
                "properties": {
                  "srcs": {
                    "function": "https://xsgames.co/randomusers/assets/avatars/pixel/42.jpg",
                    "user": "https://xsgames.co/randomusers/assets/avatars/pixel/45.jpg",
                    "assistant": "https://xsgames.co/randomusers/assets/avatars/pixel/41.jpg",
                    "system": "https://xsgames.co/randomusers/assets/avatars/pixel/21.jpg"
                  }
                }
              },
              "title": {
                "type": "Text",
                "name": "listItemTitle",
                "properties": {}
              }
            }
          },
          {
            "type": "ReactJson",
            "name": "messageArgs",
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
            "name": "messageContent"
          }
        ]
      }
    }
  }
}
```
