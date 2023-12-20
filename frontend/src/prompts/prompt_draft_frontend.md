fileSelectionTable needs to pull all the files onInit in the base directory and display them in the table as a flat list of files to select. The user can select multiple files. add the function description to the functions property of chatbot

```typescript
// utils/AppState.ts

import { Location } from "react-router-dom";
import { App, Component } from "../types/types";

// Define types for your component and app state here
export default class AppState {
  private app: any;
  private location: any;
  private setAppState: (app: App) => void;
  private customViewCache: { [key: string]: any };
  getCustomView(name: string) {
    return this.app.customViews[name];
  }
  getApp() {
    return this.app;
  }
  setState(app: App, setAppState: (app: App) => void, location: Location) {
    this.app = app;
    this.location = location;
    this.setAppState = setAppState;
  }
  constructor(app: App, setAppState: (app: App) => void, location: Location) {
    this.setState(app, setAppState, location);
    this.customViewCache = {}; // New cache to store custom view instances
  }

  getComponent(name: string) {
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
  _searchComponentByName(
    name: string,
    currentComponent: any
  ): Component | null {
    if (!currentComponent || typeof currentComponent !== "object") return null;

    // Base case: if the component's name matches, return the component
    if (currentComponent.name === name) {
      return currentComponent;
    }

    const skipKeys = ["dataSource", "current"];
    // Recursive case: iterate over all properties
    for (const key in currentComponent) {
      if (skipKeys.includes(key)) continue;
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
  changeComponent(componentName: string, newProperties: any) {
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

  getCustomViewWithItemData(
    customViewName: string,
    dataItem: any,
    index: number
  ) {
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
  _appendIndexToNames(component: any, index: number) {
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

```typescript
// components/DynamicApp.tsx
import React, { useRef } from "react";
import { Link, Routes, Route } from "react-router-dom";
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
  Row,
  Col,
  Card,
  Table,
  Modal,
} from "antd";

import DynamicForm from "./DynamicForm";
import AppState from "../utils/AppState";
import * as appFunctions from "../appFunctions";
import { Component } from "../types/types";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface RenderComponentProps {
  component: Component;
  appState: AppState;
}
const RenderComponent = ({ component, appState }: RenderComponentProps) => {
  const componentRef = useRef(null);
  if (!appState || !component) return <React.Fragment />;
  component.current = componentRef.current;
  if (componentRef.current === null && component.onInit) {
    if (appFunctions.initFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions.initFunctions[component.onInit](appState, component);
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
        <RenderComponent
          key={child.name}
          component={child}
          appState={appState}
        />
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
          items={
            component.items &&
            component.items.map((item) => ({
              key: item.properties.key,
              label: (
                <Link to={item.properties.link}>{item.properties.text}</Link>
              ),
            }))
          }
        />
      );
    case "Avatar":
      return <Avatar {...component.properties} />;

    case "Card":
      return <Card {...commonProps} />;
    case "Form":
      return <DynamicForm {...commonProps} appState={appState} />;
    case "Table":
      const onRow = (record: any, rowIndex: number) => {
        return {
          onClick: () => {
            if (
              component.properties.onRow &&
              component.properties.onRow.click
            ) {
              const functionName = component.properties.onRow.click;
              if (appFunctions.rowClickFunctions[functionName]) {
                appFunctions.rowClickFunctions[functionName](
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

    case "Routes":
      return (
        <Routes {...commonProps}>
          {children &&
            children.map((child) => (
              <Route
                key={child.name}
                path={child.properties.path}
                element={
                  <RenderComponent
                    component={child.properties.element}
                    appState={appState}
                  />
                }
              />
            ))}
        </Routes>
      );
    case "CustomView":
      return (
        <RenderComponent
          component={appState.getCustomView(properties.viewName)}
          appState={appState}
        />
      );

    case "Text":
      return <Text {...properties}>{properties.text}</Text>;

    case "PreformattedText":
      return <pre {...properties}>{properties.text}</pre>;
    case "string":
      return component.properties.text;

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
                  <RenderComponent
                    component={customViewClone}
                    appState={appState}
                  />
                )}
              </List.Item>
            );
          }}
        />
      );

    case "List.Item":
      return (
        <List.Item {...commonProps}>
          {children &&
            children.map((child) => (
              <RenderComponent
                key={child.name}
                component={child}
                appState={appState}
              />
            ))}
        </List.Item>
      );

    case "List.Item.Meta":
      return (
        <List.Item.Meta
          avatar={
            properties.avatar && (
              <RenderComponent
                component={properties.avatar}
                appState={appState}
              />
            )
          }
          title={
            properties.title && (
              <RenderComponent
                component={properties.title}
                appState={appState}
              />
            )
          }
          description={
            properties.description && (
              <RenderComponent
                component={properties.description}
                appState={appState}
              />
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
          items={
            component.items &&
            component.items.map((item) => ({
              ...item.properties,
              children: (
                <>
                  {item.children &&
                    item.children.map((child) => {
                      console.log("child", child);
                      return (
                        <RenderComponent
                          key={child.name}
                          component={child}
                          appState={appState}
                        />
                      );
                    })}
                </>
              ),
            }))
          }
        />
      );
    case "Search":
      return (
        <Input.Search
          {...commonProps}
          onSearch={(value) => {
            if (
              component.onSearch &&
              appFunctions.searchFunctions[component.onSearch]
            ) {
              appFunctions.searchFunctions[component.onSearch](
                value,
                appState,
                component
              );
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
interface DynamicAppProps {
  appState: AppState;
}
const DynamicApp = ({ appState }: DynamicAppProps) => {
  return <RenderComponent component={appState.getApp()} appState={appState} />;
};

export default DynamicApp;
```

```typescript
// services/webServices.ts
import axios from "axios";
import { Message } from "../types/types";

const baseUrl = "http://localhost:3001/api";

// Helper function to send requests to the /webService endpoint
const sendWebServiceRequest = async (
  pluginType: string,
  action: string,
  params: any
) => {
  const response = await axios.post(`${baseUrl}/webService`, {
    pluginType,
    action,
    params,
  });
  return response.data;
};

// Function to interact with the OpenAI plugin
const chatWithOpenAI = async (messages: Message[]) => {
  return sendWebServiceRequest("openai", "chat", { messages });
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectType: string) => {
  return sendWebServiceRequest("mock", "getAllObjects", { type: objectType });
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectType: string, newObject: any) => {
  return sendWebServiceRequest("mock", "createObject", {
    type: objectType,
    data: newObject,
  });
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (
  objectType: string,
  id: string | number,
  updatedObject: any
) => {
  return sendWebServiceRequest("mock", "updateObject", {
    type: objectType,
    data: { ...updatedObject, id },
  });
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectType: string, id: string | number) => {
  return sendWebServiceRequest("mock", "deleteObject", {
    type: objectType,
    data: { id },
  });
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
  chatWithOpenAI,
};
```

```typescript
// appFunctions.ts
import dayjs from "dayjs";

import webService from "../services/webServices";
import AppState from "../utils/AppState";
import {
  Component,
  Message,
  onFormChange,
  onFormFinish,
  onInit,
  onRowClick,
  onSearch,
} from "../types/types";
import { FormInstance } from "rc-field-form";

export const sendMessage: onSearch = async (
  message: string,
  appState: AppState,
  component: Component
) => {
  // Retrieve the current message list
  const messageList = appState.getComponent("messageList");
  let newDataSource: Message[] = [];

  if (messageList) {
    // Append the new user message to the existing dataSource
    newDataSource = [
      ...messageList.properties.dataSource,
      { role: "user", content: message },
    ];

    // Update message list with the new message
    appState.changeComponent("messageList", { dataSource: newDataSource });
  }

  // Set loading indicator
  appState.changeComponent("messageInput", { loading: true, value: "" });

  try {
    // Send the updated dataSource (including the new user message) to the chatbot service
    const chatbotResponse = await webService.chatWithOpenAI(newDataSource);

    // Update message list with the response from the chatbot
    appState.changeComponent("messageList", { dataSource: chatbotResponse });
  } catch (error) {
    console.error("Error in sending message: " + error.message);
    // Handle error (e.g., display error message to user)
  } finally {
    // Reset loading indicator
    appState.changeComponent("messageInput", {
      loading: false,
      value: undefined,
    });
  }
};

export const updateEndDateRestriction: onFormFinish = (
  form: FormInstance,
  appState: AppState,
  component: Component
) => {
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
  const disableEndDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(startDate, "day");
  };

  // Update the 'disabledDate' property for the 'endDate' field
  form.setFields([
    {
      name: "endDate",
    },
  ]);

  // Update the 'disabledDate' property for the 'endDate' field
  appState.changeComponent("endDate", { disableEndDate });
};

export const submitObject: onFormFinish = async (
  values: any,
  appState: AppState,
  component: Component
) => {
  try {
    if (!component.objectType) return;
    // Check if formData has an id
    if (values.id) {
      // Update the existing project
      await webService.updateObject(component.objectType, values.id, values);
    } else {
      // Create a new project
      await webService.createObject(component.objectType, values);
    }

    // Reload the project data to reflect changes
    await loadObjectData(appState, component);

    // Handle UI changes, like showing a success notification
  } catch (error) {
    console.error(`Error submitting ${component.objectType}:`, error);
    // Handle errors, for example, show an error notification
  }
};

export const loadObjectData: onInit = async (
  appState: AppState,
  component: Component
) => {
  try {
    if (component.objectType === undefined) return;
    const objects = await webService.getAllObjects(component.objectType);
    appState.changeComponent(component.name, { dataSource: objects });
  } catch (error) {
    console.error("Error loading project data:", error);
    // Handle errors (e.g., show error message)
  }
};

export function initializeDateValuesForForm(form: Component, record: any) {
  const newRecord = { ...record };
  const formItems = form.items;

  if (formItems) {
    formItems.forEach((item) => {
      if (item.type === "DatePicker") {
        const fieldName = item.name;
        if (newRecord[fieldName]) {
          newRecord[fieldName] = dayjs(newRecord[fieldName]);
        }
      }
    });
  }

  return newRecord;
}

export const populateObjectFormOnSelection: onRowClick = (
  record: any,
  rowIndex: number,
  appState: AppState,
  component: Component
) => {
  console.log("Row selected:", record, rowIndex, component);
  if (component.objectFormName === undefined) return;
  const objectForm = appState.getComponent(component.objectFormName);
  console.log("objectForm", objectForm);
  if (objectForm && objectForm.current) {
    const formattedRecord = initializeDateValuesForForm(objectForm, record);
    (objectForm.current as FormInstance).setFieldsValue(formattedRecord);
  } else {
    console.error("Object form or form instance not found");
  }
};

/**
 * Initializes a message list item with data from the message list's dataSource.
 */
export const onInitMessageListItem: onInit = (
  appState: AppState,
  component: Component
) => {
  const dataItem = component.properties.dataItem;
  const dataIndex = component.properties.dataIndex;

  if (!dataItem) {
    console.error("Data item not found for message list item initialization.");
    return;
  }

  // Adjust component names based on dataIndex
  const adjustedName = (baseName: string) => `${baseName}_${dataIndex}`;

  // Update Title component
  const listItemTitleName = adjustedName("listItemTitle");
  appState.changeComponent(listItemTitleName, {
    text: dataItem.role.toUpperCase(), // For example, setting text to role in uppercase
  });

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
  } else {
    // Hide messageArgs component if the role is not a function
    const messageArgsName = adjustedName("messageArgs");
    appState.changeComponent(messageArgsName, { style: { display: "none" } });
  }
};

export const formFinishFunctions: Record<string, onFormFinish> = {
  submitObject,
};
export const formChangeFunctions: Record<string, onFormChange> = {
  updateEndDateRestriction,
};

export const initFunctions: Record<string, onInit> = {
  onInitMessageListItem,
  loadObjectData,
};

export const rowClickFunctions: Record<string, onRowClick> = {
  populateObjectFormOnSelection,
};

export const searchFunctions: Record<string, onSearch> = { sendMessage };
```

```typescript
// components/DynamicForm.tsx
import React from "react";
import { Form, InputNumber, Input, DatePicker, Button, Select } from "antd";
import * as appFunctions from "../appFunctions";
import { Component } from "../types/types";
import AppState from "../utils/AppState";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type DynamicFormProps = {
  component: Component;
  appState: AppState;
};
const DynamicForm = ({ component, appState }: DynamicFormProps) => {
  const [form] = Form.useForm();
  component.current = form;
  if (component.current === null && component.onInit)
    if (appFunctions.initFunctions[component.onInit] === undefined)
      console.log(`Function ${component.onInit} not found`);
    else appFunctions.initFunctions[component.onInit](appState, component);

  const renderFormItem = (item: Component) => {
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
      <Form.Item {...item.formItemProps} key={item.name}>
        {formInput}
      </Form.Item>
    );
  };

  return (
    <Form
      form={form}
      layout={component.properties.layout}
      onFinish={(values) =>
        appFunctions.formFinishFunctions[component.properties.onSubmit](
          values,
          appState,
          component
        )
      }
      onFieldsChange={(changedFields, allFields) => {
        changedFields.forEach((field) => {
          if (component.items === undefined) return;
          const fieldName = field.name[field.name.length - 1];
          // Check if the changed field has a linked function and execute it
          const fieldComponent = component.items.find(
            (item) => item.name === fieldName
          );
          if (
            fieldComponent &&
            fieldComponent.onChange &&
            appFunctions.formChangeFunctions[fieldComponent.onChange]
          ) {
            appFunctions.formChangeFunctions[fieldComponent.onChange](
              form,
              appState,
              fieldComponent
            );
          }
        });
      }}
    >
      {component.items && component.items.map(renderFormItem)}
    </Form>
  );
};

export default DynamicForm;
```

```typescript
// chatbot.ts
import { App } from "../types/types";

const chatbotApp: App = {
  type: "Layout",
  name: "chatbotLayout",
  properties: {
    style: { layout: "vertical" },
  },
  children: [
    {
      type: "Header",
      name: "chatbotHeader",
      properties: {},
      children: [
        {
          type: "Menu",
          name: "chatbotMenu",
          properties: {
            theme: "dark",
            mode: "horizontal",
            defaultSelectedKeys: ["Chat"],
          },
          items: [
            {
              type: "MenuItem",
              name: "chatbotMenuItem",
              properties: {
                key: "Chat",
                link: "/",
                text: "Chat",
              },
            },
          ],
        },
      ],
    },
    {
      type: "Content",
      name: "chatbotContent",
      properties: {
        style: { padding: "24px" },
      },
      children: [
        {
          type: "Tabs",
          name: "mainTabs",
          properties: {
            defaultActiveKey: "1",
          },
          items: [
            {
              type: "TabPane",
              name: "chatTab",
              properties: {
                label: "Chat",
                key: "1",
              },
              children: [
                {
                  type: "List",
                  name: "messageList",
                  properties: {
                    itemLayout: "vertical",
                    dataSource: [
                      {
                        role: "system",
                        content: "You are a helpful assistant.",
                      },
                    ],
                    renderItem: {
                      type: "CustomView",
                      name: "messageItemView",
                      properties: {
                        viewName: "MessageItemView",
                      },
                    },
                  },
                },
                {
                  type: "Search",
                  name: "messageInput",
                  onSearch: "sendMessage",
                  properties: {
                    placeholder: "Send message to chatbot",
                  },
                },
              ],
            },
            {
              type: "TabPane",
              name: "fileSelectionTab",
              properties: {
                label: "File Selection",
                key: "2",
              },
              children: [
                {
                  type: "Table",
                  name: "fileSelectionTable",
                  properties: {
                    rowSelection: {
                      type: "checkbox",
                      onChange: "handleFileSelection",
                    },
                    columns: [
                      // Define your columns here, e.g., file name, size, etc.
                    ],
                    dataSource: [
                      // This should be dynamically populated with file data
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "Footer",
      name: "chatbotFooter",
      properties: {
        text: "© 2023 Chatbot Application",
      },
    },
  ],
  functions: {
    sendMessage: {
      description:
        "This function is triggered when the 'Send' button is clicked. It sends the user's message to the chatbot service and retrieves the response. The function then updates the 'messageList' with both the user's message and the chatbot's response.",
    },
    onInitMessageListItem: {
      description:
        "The onInitMessageListItem function dynamically initializes each messageListItem component in the chat interface. It takes data from the dataItem of the message list's dataSource, setting properties like avatar and message content. This function is essential for rendering the chat flow, as it adapts the display of messages based on their type and sender, ensuring a responsive and user-friendly chat experience.",
    },
  },
  customViews: {
    MessageItemView: {
      type: "List.Item",
      name: "messageListItem",
      properties: {
        dataIndex: -1,
        dataItem: {},
      },
      onInit: "onInitMessageListItem",
      children: [
        {
          type: "List.Item.Meta",
          name: "listItemMeta",
          properties: {
            avatar: {
              type: "Avatar",
              name: "listItemAvatar",
              properties: {
                srcs: {
                  function:
                    "https://xsgames.co/randomusers/assets/avatars/pixel/42.jpg",
                  user: "https://xsgames.co/randomusers/assets/avatars/pixel/45.jpg",
                  assistant:
                    "https://xsgames.co/randomusers/assets/avatars/pixel/41.jpg",
                  system:
                    "https://xsgames.co/randomusers/assets/avatars/pixel/21.jpg",
                },
              },
            },
            title: {
              type: "Text",
              name: "listItemTitle",
              properties: {},
            },
          },
        },
        {
          type: "ReactJson",
          name: "messageArgs",
          properties: {
            src: {},
            theme: "rjv-default",
            collapsed: false,
            enableClipboard: true,
            displayObjectSize: true,
            displayDataTypes: false,
            indentWidth: 4,
          },
        },
        {
          type: "PreformattedText",
          name: "messageContent",
          properties: {
            style: {
              whiteSpace: "pre-wrap", // Wraps the text
              wordWrap: "break-word", // This ensures that the text breaks to prevent overflow
            },
          },
        },
      ],
    },
  },
};

export default chatbotApp;
```

```javascript
// routes/webService.js
const express = require("express");
const router = express.Router();

// Assume MockDatabasePlugin and SQLDatabasePlugin are implemented plugins
const MockDatabasePlugin = require("../plugins/mockDatabasePlugin");
const SQLDatabasePlugin = require("../plugins/sqlDatabasePlugin");
const OpenAIPlugin = require("../plugins/openAiPlugin");
const FileSystemPlugin = require("../plugins/fsPlugin");

// Initialize plugins
const plugins = {
  mock: new MockDatabasePlugin(),
  sql: new SQLDatabasePlugin(),
  openai: new OpenAIPlugin(),
  fs: new FileSystemPlugin("../"),
};

// Single /webService endpoint
router.post("/webService", (req, res) => {
  const { pluginType, action, params } = req.body;
  console.log("pluginType", pluginType, "action", action);
  // Select the appropriate plugin
  const plugin = plugins[pluginType];
  if (!plugin) {
    return res.status(400).json({ message: "Invalid plugin type" });
  }

  // Execute the action
  try {
    if (typeof plugin[action] === "function") {
      // Call the action method with request and response webService
      res.json(plugin[action](params));
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(error.status ?? 500).json({ message: error.message });
  }
});

module.exports = router;
```

```javascript
// openAiPlugin.js
const OpenAI = require("openai");

class OpenAIPlugin {
  constructor() {
    // Initialize OpenAI API with your API key
    this.openai = new OpenAI();
  }

  async chat(req, res) {
    const { messages } = req.body.data;
    if (!messages) {
      throw new Error("Messages is required", { status: 400 });
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages,
      });

      messages.push({
        role: "assistant",
        content: completion.choices[0].message.content,
      });
      return messages;
    } catch (error) {
      throw new Error(error.message, { status: 500, cause: error });
    }
  }
}

module.exports = OpenAIPlugin;
```

```javascript
// mockDatabasePlugin.js
const fs = require("fs");

class MockDatabasePlugin {
  constructor() {
    this.dataPath = "./data/data.json";
  }

  readData() {
    const jsonData = fs.readFileSync(this.dataPath);
    return JSON.parse(jsonData);
  }

  writeData({ data }) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 4));
  }

  getAllObjects({ type }) {
    console.log("getAllObjects", type);

    let data = this.readData();
    if (type) data = data[type] ?? [];
    return data;
  }

  createObject({ type, newObject }) {
    // Read existing data
    const data = this.readData();
    if (!data[type]) data[type] = [];
    const objects = data[type];

    // Generate a new ID for the object
    const newObjectId =
      objects.length > 0 ? objects[objects.length - 1].id + 1 : 1;

    // Add the new object to the data
    newObject.id = newObjectId;
    objects.push(newObject);

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the new object
    return newObject;
  }

  updateObject({ type, id, updatedObject }) {
    const objectId = parseInt(id);

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      throw new Error("Type not found", { status: 404 });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      throw new Error("Object not found", { status: 404 });
    }

    // Update the object
    data[type][objectIndex] = { ...data[type][objectIndex], ...updatedObject };

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the updated object
    return data[type][objectIndex];
  }

  deleteObject({ type, id }) {
    const objectId = parseInt(id);

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      throw new Error("Type not found", { status: 404 });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      throw new Error("Object not found", { status: 404 });
    }

    // Remove the object
    const [deletedObject] = data[type].splice(objectIndex, 1);

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the deleted object
    return deletedObject;
  }
}

module.exports = MockDatabasePlugin;
```

```javascript
// server.js
const express = require("express");
const cors = require("cors");
const objectRoutes = require("./routes/webService");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing for all routes

app.use("/api", objectRoutes); // Use the tickets routes for all /api routes

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```
