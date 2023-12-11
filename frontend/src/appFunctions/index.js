// appFunctions/index.js
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

export const submitObject = async (values, appState) => {
  try {
    if (values.projectId) {
      // If projectId exists, it's an update operation
      await objectService.updateObject(values.projectId, values);
    } else {
      // If projectId does not exist, it's a create operation
      await objectService.createObject(values);
    }
    // Handle successful operation (e.g., show notification, redirect, etc.)
  } catch (error) {
    // Handle errors (e.g., show error message)
    console.error("Error submitting form:", error);
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
