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
    appState.changeComponent("projectOverviewTable", { dataSource: projects });
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
