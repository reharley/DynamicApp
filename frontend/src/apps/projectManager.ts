// chatbot.ts
import { App } from "../types/types";

// Define menu items
const menuItemHome = {
  type: "MenuItem",
  name: "menuItemHome",
  properties: {
    key: "Home",
    link: "/",
    text: "Home",
  },
};

const menuItemProjects = {
  type: "MenuItem",
  name: "menuItemProjects",
  properties: {
    key: "Projects",
    link: "/projects",
    text: "Projects",
  },
};

const menuItemTeams = {
  type: "MenuItem",
  name: "menuItemTeams",
  properties: {
    key: "Teams",
    link: "/teams",
    text: "Teams",
  },
};

const menuItemReports = {
  type: "MenuItem",
  name: "menuItemReports",
  properties: {
    key: "Reports",
    link: "/reports",
    text: "Reports",
  },
};

// Define main menu
const mainMenu = {
  type: "Menu",
  name: "mainMenu",
  properties: {
    theme: "dark",
    mode: "horizontal",
    defaultSelectedKeys: ["Home"],
  },
  onInit: "initMainMenu",
  items: [menuItemHome, menuItemProjects, menuItemTeams, menuItemReports],
};

// Define main header
const mainHeader = {
  type: "Header",
  name: "mainHeader",
  properties: {},
  children: [mainMenu],
};

// Define routes
const homeRoute = {
  type: "Route",
  name: "homeRoute",
  properties: {
    path: "/",
    element: {
      type: "CustomView",
      name: "projectsView",
      properties: {
        viewName: "ProjectsView",
      },
    },
  },
};

const projectsRoute = {
  type: "Route",
  name: "projectsRoute",
  properties: {
    path: "/projects",
    element: {
      type: "CustomView",
      name: "projectsView",
      properties: {
        viewName: "ProjectsView",
      },
    },
  },
};

const teamsRoute = {
  type: "Route",
  name: "teamsRoute",
  properties: {
    path: "/teams",
    element: {
      type: "CustomView",
      name: "teamsView",
      properties: {
        viewName: "TeamsView",
      },
    },
  },
};

const reportsRoute = {
  type: "Route",
  name: "reportsRoute",
  properties: {
    path: "/reports",
    element: {
      type: "CustomView",
      name: "reportsView",
      properties: {
        viewName: "ReportsView",
      },
    },
  },
};

const mainRoutes = {
  type: "Routes",
  name: "mainRoutes",
  children: [homeRoute, projectsRoute, teamsRoute, reportsRoute],
};

// Define main content
const mainContent = {
  type: "Content",
  name: "mainContent",
  properties: {
    style: { padding: "24px" },
  },
  children: [mainRoutes],
};

// Define main footer
const mainFooter = {
  type: "Footer",
  name: "mainFooter",
  properties: {
    text: "© 2023 Project Management Dashboard",
  },
};

// Define notification modal
const notificationModal = {
  type: "Modal",
  name: "notificationModal",
  properties: {
    title: "Notification",
    content: "Your changes have been saved.",
  },
};
// Define components for ProjectsView
const projectFormItems = [
  {
    type: "Input",
    name: "id",
    formItemProps: {
      label: "Project ID",
      name: "id",
      style: { display: "none" }, // Hidden field for ID
    },
  },
  {
    type: "Input",
    name: "projectName",
    formItemProps: {
      label: "Project Name",
      name: "projectName",
      rules: [
        {
          required: true,
          message: "Please input the project name!",
        },
      ],
    },
  },
  {
    type: "DatePicker",
    name: "startDate",
    onChange: "updateEndDateRestriction",
    formItemProps: {
      label: "Start Date",
      name: "startDate",
      rules: [
        {
          required: true,
          message: "Please select the start date!",
        },
      ],
    },
  },
  {
    type: "DatePicker",
    name: "endDate",
    formItemProps: {
      label: "End Date",
      name: "endDate",
      rules: [
        {
          required: true,
          message: "Please select the end date!",
        },
      ],
    },
  },
  {
    type: "Select",
    name: "status",
    properties: {
      options: [
        { label: "Planning", value: "Planning" },
        { label: "Active", value: "Active" },
        { label: "Completed", value: "Completed" },
        // Additional statuses can be added as needed
      ],
    },
    formItemProps: {
      label: "Status",
      name: "status",
      rules: [
        {
          required: true,
          message: "Please select the status!",
        },
      ],
    },
  },
  {
    type: "TextArea",
    name: "description",
    formItemProps: {
      label: "Description",
      name: "description",
      rules: [
        {
          required: true,
          message: "Please input the description!",
        },
      ],
    },
  },
  {
    type: "Button",
    name: "submitObjectButton",
    properties: {
      type: "primary",
      htmlType: "submit",
      text: "Submit",
      name: "submitButton",
    },
  },
  // Additional fields can be added as needed
];

const projectForm = {
  type: "Form",
  name: "projectForm",
  objectType: "Project",
  properties: {
    layout: "vertical",
    onSubmit: "submitObject",
  },
  items: projectFormItems,
};

const projectCard = {
  type: "Card",
  name: "projectCard",
  properties: {
    title: "New Project Entry",
  },
  children: [projectForm],
};

const leftColumnProjects = {
  type: "Col",
  name: "leftColumn",
  properties: {
    span: 12,
  },
  children: [projectCard],
};

// Define components for projectOverviewTable
const projectOverviewTable = {
  type: "Table",
  name: "projectOverviewTable",
  objectType: "Project",
  objectFormName: "projectForm",
  properties: {
    onRow: {
      click: "populateObjectFormOnSelection",
    },
    columns: [
      {
        title: "Project Name",
        dataIndex: "projectName",
        key: "projectName",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        // You might want to format the date for better readability
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        // You might want to format the date for better readability
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      // Additional columns can be added as needed
    ],
    dataSource: [], // This would be populated dynamically, typically from an API
  },
  onInit: "loadObjectData", // Function to load data when the table is initialized
};

const projectOverviewCard = {
  type: "Card",
  name: "projectOverviewCard",
  properties: {
    title: "Project Overview",
  },
  children: [projectOverviewTable],
};

const rightColumnProjects = {
  type: "Col",
  name: "rightColumn",
  properties: {
    span: 12,
  },
  children: [projectOverviewCard],
};

const mainRowProjects = {
  type: "Row",
  name: "mainRow",
  properties: {
    gutter: 16,
  },
  children: [leftColumnProjects, rightColumnProjects],
};

// Define ProjectsView
const ProjectsView = {
  type: "Row",
  name: "mainRow",
  properties: {
    gutter: 16,
  },
  children: [mainRowProjects],
};

const teamFormItems = [
  {
    type: "Input",
    name: "id",
    formItemProps: {
      label: "Team ID",
      name: "id",
      style: { display: "none" }, // Hidden field for ID
    },
  },
  {
    type: "Input",
    name: "teamName",
    formItemProps: {
      label: "Team Name",
      name: "teamName",
      rules: [
        {
          required: true,
          message: "Please input the team name!",
        },
      ],
    },
  },
  {
    type: "Input",
    name: "teamLeader",
    formItemProps: {
      label: "Team Leader",
      name: "teamLeader",
      rules: [
        {
          required: true,
          message: "Please input the name of the team leader!",
        },
      ],
    },
  },
  {
    type: "Select",
    name: "teamMembers",
    properties: {
      mode: "multiple",
      placeholder: "Select team members",
      // Assuming options are defined elsewhere or fetched dynamically
      options: [
        // Example options (should be dynamically generated based on actual data)
        { label: "Member 1", value: "member1" },
        { label: "Member 2", value: "member2" },
        // ... more members
      ],
    },
    formItemProps: {
      label: "Team Members",
      name: "teamMembers",
      rules: [
        {
          required: true,
          message: "Please select team members!",
        },
      ],
    },
  },
  {
    type: "TextArea",
    name: "description",
    formItemProps: {
      label: "Description",
      name: "description",
      rules: [
        {
          required: true,
          message: "Please input the description!",
        },
      ],
    },
  },
  // Additional fields can be added as needed
];

const teamForm = {
  type: "Form",
  name: "teamForm",
  objectType: "Team",
  properties: {
    layout: "vertical",
    onSubmit: "submitObject",
  },
  items: teamFormItems,
};

const teamCard = {
  type: "Card",
  name: "teamCard",
  properties: {
    title: "Team Management",
  },
  children: [teamForm],
};

const teamLeftColumn = {
  type: "Col",
  name: "teamLeftColumn",
  properties: {
    span: 12,
  },
  children: [teamCard],
};

// Define components for TeamOverviewTable
const teamOverviewTable = {
  type: "Table",
  name: "teamOverviewTable",
  objectType: "Team",
  objectFormName: "teamForm",
  properties: {
    onRow: {
      click: "populateObjectFormOnSelection",
    },
    columns: [
      {
        title: "Team Name",
        dataIndex: "teamName",
        key: "teamName",
      },
      {
        title: "Team Leader",
        dataIndex: "teamLeader",
        key: "teamLeader",
      },
      {
        title: "Number of Members",
        dataIndex: "numberOfMembers",
        key: "numberOfMembers",
        // Additional formatting or calculation might be needed to display this data
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      // Additional columns can be added as needed
    ],
    dataSource: [], // This would be populated dynamically, typically from an API
  },
  onInit: "loadObjectData", // Function to load data when the table is initialized
};

const teamOverviewCard = {
  type: "Card",
  name: "teamOverviewCard",
  properties: {
    title: "Teams Overview",
  },
  children: [teamOverviewTable],
};

const teamRightColumn = {
  type: "Col",
  name: "teamRightColumn",
  properties: {
    span: 12,
  },
  children: [teamOverviewCard],
};

const teamRow = {
  type: "Row",
  name: "teamRow",
  properties: {
    gutter: 16,
  },
  children: [teamLeftColumn, teamRightColumn],
};

// Define TeamsView
const TeamsView = {
  type: "Row",
  name: "teamRow",
  properties: {
    gutter: 16,
  },
  children: [teamRow],
};

const reportFormItems = [
  {
    type: "Input",
    name: "id",
    formItemProps: {
      label: "Report ID",
      name: "id",
      style: { display: "none" }, // Hidden field for ID
    },
  },
  {
    type: "Input",
    name: "reportName",
    formItemProps: {
      label: "Report Name",
      name: "reportName",
      rules: [
        {
          required: true,
          message: "Please input the report name!",
        },
      ],
    },
  },
  {
    type: "RangePicker",
    name: "dateRange",
    formItemProps: {
      label: "Date Range",
      name: "dateRange",
      rules: [
        {
          required: true,
          message: "Please select the date range!",
        },
      ],
    },
  },
  {
    type: "Select",
    name: "reportType",
    properties: {
      options: [
        { label: "Type 1", value: "type1" },
        { label: "Type 2", value: "type2" },
        // Add more report types as needed
      ],
    },
    formItemProps: {
      label: "Report Type",
      name: "reportType",
      rules: [
        {
          required: true,
          message: "Please select the report type!",
        },
      ],
    },
  },
];

const reportForm = {
  type: "Form",
  name: "reportForm",
  objectType: "Report",
  properties: {
    layout: "vertical",
    onSubmit: "submitObject",
  },
  items: reportFormItems,
};

const reportCreationCard = {
  type: "Card",
  name: "reportCreationCard",
  properties: {
    title: "Report Creation",
  },
  children: [reportForm],
};

const reportsLeftColumn = {
  type: "Col",
  name: "reportsLeftColumn",
  properties: {
    span: 12,
  },
  children: [reportCreationCard],
};

// Define components for ReportsTable
const reportsTable = {
  type: "Table",
  name: "reportsTable",
  objectType: "Report",
  objectFormName: "reportForm",
  properties: {
    onRow: {
      click: "populateObjectFormOnSelection",
    },
    columns: [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Report Name",
        dataIndex: "reportName",
        key: "reportName",
      },
      {
        title: "Date Range",
        dataIndex: "dateRange",
        key: "dateRange",
        // Custom render function can be defined to format date range
      },
      {
        title: "Report Type",
        dataIndex: "reportType",
        key: "reportType",
      },
      // Additional columns can be added as needed
    ],
    dataSource: [], // This would be populated dynamically, typically from an API
  },
  onInit: "loadObjectData", // Function to load data when the table is initialized
};

const reportsOverviewCard = {
  type: "Card",
  name: "reportsOverviewCard",
  properties: {
    title: "Reports Overview",
  },
  children: [reportsTable],
};

const reportsRightColumn = {
  type: "Col",
  name: "reportsRightColumn",
  properties: {
    span: 12,
  },
  children: [reportsOverviewCard],
};

const reportsRow = {
  type: "Row",
  name: "reportsRow",
  properties: {
    gutter: 16,
  },
  children: [reportsLeftColumn, reportsRightColumn],
};

// Define ReportsView
const ReportsView = {
  type: "Row",
  name: "reportsRow",
  properties: {
    gutter: 16,
  },
  children: [reportsRow],
};

// Construct the final App object
const projectManagerApp: App = {
  type: "Layout",
  name: "mainLayout",
  properties: {
    style: { layout: "vertical" },
  },
  children: [mainHeader, mainContent, mainFooter, notificationModal],
  functions: {
    initMainMenu: {
      description:
        "This function is triggered during the initialization of the 'mainMenu' component. It sets the 'selectedKey' of the menu to match the current route if the key exists. This ensures that the correct menu item is highlighted based on the current navigation context, enhancing the user experience by providing visual feedback on the active menu item.",
    },
    loadObjectData: {
      description:
        "This function is triggered when a component like a table or form is initialized. It fetches the relevant data for the specified object type (e.g., projects, teams) from the backend and updates the component's dataSource. This function ensures that the component displays the most current data as soon as it loads.",
    },
    populateObjectFormOnSelection: {
      description:
        "This function is activated when a user selects an object row in the 'projectOverviewTable'. It retrieves the data from the selected row and populates the 'projectForm' fields with this information for editing. The function ensures each form field corresponds to an attribute of the selected object, enabling the user to edit object details. It includes error handling for scenarios where object data is incomplete or fails to load, providing user-friendly feedback. This function is integral for maintaining a dynamic and interactive user experience, allowing real-time editing of object data directly from the overview table.",
    },
    submitObject: {
      description:
        "This function is responsible for submitting project data to the backend. It determines whether to create a new project or update an existing one based on the presence of an 'id' in the formData. If an 'id' is present, the function updates the project with the given 'id'; otherwise, it creates a new project. After successful submission or updating, the function reloads the project overview to ensure the displayed data is up-to-date. This approach maintains data integrity and ensures the user interface reflects the latest state of project data.",
    },
    updateEndDateRestriction: {
      description:
        "This function is triggered when the start date changes. It should ensure the end date cannot be before the start date, clearing the end date if it is before the start date, and disabling dates before the start date for the end date.",
    },
    onInitProjectForm: {
      description:
        "This function is triggered when the 'projectForm' component initializes. It generates a random Globally Unique Identifier (GUID) using the 'uuid' library and sets this GUID as the default value for the 'id' field in the form. This ensures that every new project entry starts with a unique identifier, enhancing data integrity and preventing conflicts. The function checks for the existence of the 'projectForm' and its form instance to ensure safe operation. In cases where the form or its instance is not found, an error is logged for debugging purposes. This automation streamlines the process of creating new project entries, allowing users to focus on inputting other essential project details.",
    },
  },
  customViews: {
    ProjectsView,
    TeamsView,
    ReportsView,
  },
};

export default projectManagerApp;
