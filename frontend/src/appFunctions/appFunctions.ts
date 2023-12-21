// appFunctions.ts
import dayjs from "dayjs";

import webService from "../services/webServices";
import AppState from "../utils/AppState";
import {
  Component,
  Message,
  RowOnChange,
  RowOnSelect,
  onFormChange,
  onFormFinish,
  onInit,
  onRowClick,
  File,
  onSearch,
} from "../types/types";
import { FormInstance } from "rc-field-form";

/**
 * Flattens the folder structure to a list of files.
 * @param {Array} folderStructure The folder structure as returned by the server.
 * @param {string} basePath The base path to prepend to file names.
 * @returns {Array} The flattened list of files.
 */
const flattenFolderStructure = (
  folderStructure: any[],
  basePath = ""
): File[] => {
  let files: File[] = [];
  for (const item of folderStructure) {
    if (item.type === "file") {
      files.push({
        key: basePath + item.name,
        name: item.name,
        path: basePath + item.name,
        type: item.type,
      });
    } else if (item.type === "directory" && item.children) {
      files = files.concat(
        flattenFolderStructure(item.children, basePath + item.name + "/")
      );
    }
  }
  return files;
};

/**
 * Initializes the fileSelectionTable component with file data.
 */
export const fileSelectionInit: onInit = async (
  appState: AppState,
  component: Component
) => {
  try {
    console.log("Initializing file selection table.");
    // Define the columns with search functionality
    const fileTableColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        filters: [
          {
            text: "src",
            value: "src",
          },
          {
            text: ".ts",
            value: ".ts",
          },
          {
            text: ".js",
            value: ".js",
          },
        ],
        filterMode: "tree",
        filterSearch: true,
        onFilter: (value: string, record: File) => record.name.includes(value),
        // filterSearch: true, // Enables search on this column
        sorter: true, // Enables sorting on this column
      },
      {
        title: "Path",
        dataIndex: "path",
        key: "path",
        // Additional column properties
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        // Other column properties
      },
      // Add more columns as needed
    ];

    // Replace 'folderPath' with the actual path you want to fetch
    const folderStructure = await webService.getFolderStructure("folderPath");

    // Flatten the folder structure to get a list of files
    const files = flattenFolderStructure(folderStructure);

    // Update the fileSelectionTable component's dataSource with the files
    appState.changeComponent("fileSelectionTable", {
      dataSource: files,
      columns: fileTableColumns,
    });
  } catch (error) {
    console.error("Error initializing file selection table:", error);
    // Handle errors, for example, show an error notification
  }
};

async function getFileContents(selectedFiles: File[]) {
  // Extract the paths of the selected files
  const filePaths = selectedFiles.map((file) => file.path);

  // Fetch the contents of the selected files
  const filesContent = await webService.getFilesContent(filePaths);

  // Format each file's content in Markdown style
  return filesContent
    .map((file) => {
      const simplifiedPath = file.path.split("/").slice(-2).join("/"); // Simplify the path
      return `\`\`\`${file.type}\nPath: ${simplifiedPath}\nName: ${file.name}\n\n${file.content}\n\`\`\``;
    })
    .join("\n\n");
}

export const sendMessage: onSearch = async (
  message: string,
  appState: AppState,
  component: Component
) => {
  // Retrieve the current message list and update it immediately with the user's message
  const messageList = appState.getComponent("messageList");
  let newDataSource = messageList
    ? [...messageList.properties.dataSource, { role: "user", content: message }]
    : [{ role: "user", content: message }];

  // Update the message list and set loading indicator for immediate feedback
  appState.changeComponent("messageList", { dataSource: newDataSource });
  appState.changeComponent("messageInput", { loading: true, value: "" });

  try {
    // Retrieve selected files from fileSelectionTable
    const fileSelectionTable = appState.getComponent("fileSelectionTable");
    const selectedFiles = fileSelectionTable
      ? fileSelectionTable.properties.rowSelection.selectedRows
      : [];

    // If there are selected files, get their contents and append to the message
    if (selectedFiles.length > 0) {
      const fileContents = await getFileContents(selectedFiles);
      const lastMessageIndex = newDataSource.length - 1;
      newDataSource[lastMessageIndex] = {
        role: "user",
        content: message + `\nAttached Files:\n${fileContents}`,
      };
      appState.changeComponent("messageList", { dataSource: newDataSource });
    }

    // Send the updated dataSource to the chatbot service
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

  const fileSelectionTable = appState.getComponent("fileSelectionTable");
  console.log("fileSelectionTable", fileSelectionTable);

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
  fileSelectionInit,
};

export const rowClickFunctions: Record<string, onRowClick> = {
  populateObjectFormOnSelection,
};

export const searchFunctions: Record<string, onSearch> = { sendMessage };
export const rowSelectionSelectFunctions: Record<string, RowOnSelect> = {};
export const rowSelectionChangeFunctions: Record<string, RowOnChange> = {};
