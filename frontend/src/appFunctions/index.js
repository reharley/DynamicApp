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

/**
 * Initializes the main menu by setting the selected key based on the current route.
 * @param {AppState} appState - The state of the application.
 * @param {Component} component - The component that triggered the event.
 */
export function initMainMenu(appState, component) {
  // Retrieve the mainMenu component from the app state
  const mainMenu = appState.getComponent(component.name);
  console.log("mainMenu", mainMenu);
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
