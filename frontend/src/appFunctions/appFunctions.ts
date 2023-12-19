// appFunctions.js
import dayjs from "dayjs";

import objectService from "../services/objectService";
import AppState from "../utils/AppState";
import {
  Component,
  onFormChange,
  onFormFinish,
  onInit,
  onRowClick,
  onSearch,
} from "../types/types";
import { FormInstance } from "rc-field-form";

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
      await objectService.updateObject(component.objectType, values.id, values);
    } else {
      // Create a new project
      await objectService.createObject(component.objectType, values);
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
    const objects = await objectService.getAllObjects(component.objectType);
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

export const searchFunctions: Record<string, onSearch> = {};
