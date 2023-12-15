Build unit tests in appFunction.test.js for appFunctions.js given the function description and the use case in the app.json.

Consider each function's purpose, inputs, and expected outputs, test cases.

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

sample app json

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
              "defaultSelectedKeys": ["Browse"]
            },
            "onInit": "initMainMenu",
            "items": [
              {
                "type": "MenuItem",
                "name": "browseBooks",
                "properties": {
                  "key": "Browse",
                  "link": "/browse"
                },
                "text": "Browse Books"
              },
              {
                "type": "MenuItem",
                "name": "userProfile",
                "properties": {
                  "key": "Profile",
                  "link": "/profile"
                },
                "text": "My Profile"
              },
              {
                "type": "MenuItem",
                "name": "adminPanel",
                "properties": {
                  "key": "Admin",
                  "link": "/admin"
                },
                "text": "Admin Panel"
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
                  "path": "/browse",
                  "element": {
                    "type": "CustomView",
                    "name": "bookListView",
                    "properties": {
                      "viewName": "BookListView",
                      "searchAlgorithm": "Relevance-based search with filters",
                      "realTimeAvailabilityUpdate": true
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "browseRoute",
                "properties": {
                  "path": "/browse",
                  "element": {
                    "type": "CustomView",
                    "name": "bookListView",
                    "properties": {
                      "viewName": "BookListView",
                      "searchAlgorithm": "Relevance-based search with filters",
                      "realTimeAvailabilityUpdate": true
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "profileRoute",
                "properties": {
                  "path": "/profile",
                  "element": {
                    "type": "CustomView",
                    "name": "userProfileView",
                    "properties": {
                      "viewName": "UserProfileView",
                      "userWorkflow": "Manage account, write reviews, view order history"
                    }
                  }
                }
              },
              {
                "type": "Route",
                "name": "adminRoute",
                "properties": {
                  "path": "/admin",
                  "element": {
                    "type": "CustomView",
                    "name": "adminPanelView",
                    "properties": {
                      "viewName": "AdminPanelView",
                      "managementFunctions": "Catalog management, order processing, user management"
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
          "text": "© 2023 Online Bookstore"
        }
      }
    ],
    "customViews": {
      "BookListView": {
        "type": "Row",
        "name": "bookListRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "bookListColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Search",
                "name": "bookSearch",
                "properties": {
                  "placeholder": "Search for books",
                  "onSearch": "searchBooks"
                }
              },
              {
                "type": "Table",
                "name": "bookTable",
                "objectType": "Book",
                "properties": {
                  "columns": [
                    { "title": "Title", "dataIndex": "title", "key": "title" },
                    {
                      "title": "Author",
                      "dataIndex": "author",
                      "key": "author"
                    },
                    { "title": "Price", "dataIndex": "price", "key": "price" },
                    { "title": "ISBN", "dataIndex": "isbn", "key": "isbn" },
                    { "title": "Genre", "dataIndex": "genre", "key": "genre" },
                    {
                      "title": "Description",
                      "dataIndex": "description",
                      "key": "description"
                    }
                  ],
                  "dataSource": [],
                  "onRow": { "click": "viewBookDetails" }
                },
                "onInit": "loadBookData"
              }
            ]
          }
        ]
      },
      "UserProfileView": {
        "type": "Row",
        "name": "userProfileRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "userProfileColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Form",
                "name": "userProfileForm",
                "objectType": "UserProfile",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitUserProfile",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
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
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  { "label": "Name", "type": "Input", "name": "name" },
                  { "label": "Email", "type": "Input", "name": "email" },
                  { "label": "Address", "type": "Input", "name": "address" },
                  {
                    "type": "Button",
                    "name": "saveProfileButton",
                    "properties": {
                      "type": "primary",
                      "htmlType": "submit",
                      "text": "Save"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "AdminPanelView": {
        "type": "Row",
        "name": "adminPanelRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "adminPanelColumn",
            "properties": {
              "span": 24
            },
            "children": [
              {
                "type": "Tabs",
                "name": "adminTabs",
                "properties": {},
                "items": [
                  {
                    "key": "catalog",
                    "label": "Catalog Management",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "catalogManagementView",
                        "properties": {
                          "viewName": "CatalogManagementView"
                        }
                      }
                    ]
                  },
                  {
                    "key": "orders",
                    "label": "Order Processing",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "orderProcessingView",
                        "properties": {
                          "viewName": "OrderProcessingView"
                        }
                      }
                    ]
                  },
                  {
                    "key": "users",
                    "label": "User Management",
                    "children": [
                      {
                        "type": "CustomView",
                        "name": "userManagementView",
                        "properties": {
                          "viewName": "UserManagementView"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "CatalogManagementView": {
        "type": "Row",
        "name": "catalogManagementRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "leftCatalogManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "bookForm",
                "objectType": "Book",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitBookForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
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
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "Title",
                    "type": "Input",
                    "name": "title"
                  },
                  {
                    "label": "Author",
                    "type": "Input",
                    "name": "author"
                  },
                  {
                    "label": "Price",
                    "type": "Input",
                    "name": "price"
                  },
                  {
                    "label": "ISBN",
                    "type": "Input",
                    "name": "isbn"
                  },
                  {
                    "label": "Genre",
                    "type": "Select",
                    "name": "genre"
                  },
                  {
                    "label": "Cover Image URL",
                    "type": "Input",
                    "name": "coverImageUrl"
                  },
                  {
                    "label": "Description",
                    "type": "TextArea",
                    "name": "description"
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "rightCatalogManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "bookTable",
                "objectType": "Book",
                "properties": {
                  "columns": [
                    { "title": "Title", "dataIndex": "title", "key": "title" },
                    {
                      "title": "Author",
                      "dataIndex": "author",
                      "key": "author"
                    },
                    { "title": "Price", "dataIndex": "price", "key": "price" },
                    { "title": "ISBN", "dataIndex": "isbn", "key": "isbn" },
                    { "title": "Genre", "dataIndex": "genre", "key": "genre" },
                    {
                      "title": "Description",
                      "dataIndex": "description",
                      "key": "description"
                    },
                    {
                      "title": "Cover Image URL",
                      "dataIndex": "coverImageUrl",
                      "key": "coverImageUrl"
                    },
                    {
                      "title": "Rating",
                      "dataIndex": "rating",
                      "key": "rating"
                    },
                    {
                      "title": "Inventory Count",
                      "dataIndex": "inventoryCount",
                      "key": "inventoryCount"
                    },
                    {
                      "title": "Publish Date",
                      "dataIndex": "publishDate",
                      "key": "publishDate"
                    }
                  ],
                  "dataSource": []
                }
              }
            ]
          }
        ]
      },
      "OrderProcessingView": {
        "type": "Row",
        "name": "orderProcessingRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "leftOrderProcessingColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "orderForm",
                "objectType": "Order",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitOrderForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
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
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "Order ID",
                    "type": "Input",
                    "name": "orderId"
                  },
                  {
                    "label": "Book ID",
                    "type": "Input",
                    "name": "bookId"
                  },
                  {
                    "label": "User ID",
                    "type": "Input",
                    "name": "userId"
                  },
                  {
                    "label": "Quantity",
                    "type": "InputNumber",
                    "name": "quantity"
                  },
                  {
                    "label": "Order Date",
                    "type": "DatePicker",
                    "name": "orderDate"
                  },
                  {
                    "label": "Total Amount",
                    "type": "InputNumber",
                    "name": "totalAmount"
                  },
                  {
                    "label": "Status",
                    "type": "Select",
                    "name": "status",
                    "properties": {
                      "options": [
                        { "label": "Pending", "value": "Pending" },
                        { "label": "Completed", "value": "Completed" },
                        { "label": "Cancelled", "value": "Cancelled" }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "rightOrderProcessingColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "orderTable",
                "objectType": "Order",
                "properties": {
                  "columns": [
                    {
                      "title": "Order ID",
                      "dataIndex": "orderId",
                      "key": "orderId"
                    },
                    {
                      "title": "Book ID",
                      "dataIndex": "bookId",
                      "key": "bookId"
                    },
                    {
                      "title": "User ID",
                      "dataIndex": "userId",
                      "key": "userId"
                    },
                    {
                      "title": "Quantity",
                      "dataIndex": "quantity",
                      "key": "quantity"
                    },
                    {
                      "title": "Order Date",
                      "dataIndex": "orderDate",
                      "key": "orderDate"
                    },
                    {
                      "title": "Total Amount",
                      "dataIndex": "totalAmount",
                      "key": "totalAmount"
                    },
                    {
                      "title": "Status",
                      "dataIndex": "status",
                      "key": "status"
                    }
                  ],
                  "dataSource": [],
                  "onRow": { "click": "viewOrderDetails" }
                },
                "onInit": "loadOrderData"
              }
            ]
          }
        ]
      },
      "UserManagementView": {
        "type": "Row",
        "name": "userManagementRow",
        "properties": {
          "gutter": 16
        },
        "children": [
          {
            "type": "Col",
            "name": "leftUserManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Form",
                "name": "userForm",
                "objectType": "User",
                "properties": {
                  "layout": "vertical",
                  "onSubmit": "submitUserForm",
                  "submitButton": {
                    "type": "Button",
                    "name": "submitTeamButton",
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
                    "type": "Input",
                    "name": "id",
                    "style": { "display": "none" }
                  },
                  {
                    "label": "User ID",
                    "type": "Input",
                    "name": "userId"
                  },
                  {
                    "label": "Name",
                    "type": "Input",
                    "name": "name"
                  },
                  {
                    "label": "Email",
                    "type": "Input",
                    "name": "email"
                  },
                  {
                    "label": "Role",
                    "type": "Select",
                    "name": "role",
                    "properties": {
                      "options": [
                        { "label": "Administrator", "value": "Administrator" },
                        {
                          "label": "Registered User",
                          "value": "RegisteredUser"
                        },
                        { "label": "Guest", "value": "Guest" }
                      ]
                    }
                  },
                  {
                    "label": "Status",
                    "type": "Select",
                    "name": "status",
                    "properties": {
                      "options": [
                        { "label": "Active", "value": "Active" },
                        { "label": "Inactive", "value": "Inactive" }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "Col",
            "name": "rightUserManagementColumn",
            "properties": {
              "span": 12
            },
            "children": [
              {
                "type": "Table",
                "name": "userTable",
                "objectType": "User",
                "properties": {
                  "columns": [
                    {
                      "title": "User ID",
                      "dataIndex": "userId",
                      "key": "userId"
                    },
                    { "title": "Name", "dataIndex": "name", "key": "name" },
                    { "title": "Email", "dataIndex": "email", "key": "email" },
                    { "title": "Role", "dataIndex": "role", "key": "role" },
                    {
                      "title": "Status",
                      "dataIndex": "status",
                      "key": "status"
                    }
                  ],
                  "dataSource": [],
                  "onRowClick": "viewUserDetails"
                },
                "onInit": "loadUserData"
              }
            ]
          }
        ]
      }
    },
    "functions": {
      "initMainMenu": {
        "description": "This function is triggered during the initialization of the 'mainMenu' component. It sets the 'selectedKey' of the menu to match the current route if the key exists. This ensures that the correct menu item is highlighted based on the current navigation context, enhancing the user experience by providing visual feedback on the active menu item."
      }
    }
  }
}
```
