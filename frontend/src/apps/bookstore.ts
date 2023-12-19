// chatbot.ts
import { App } from "../types/types";

const bookStore: App = {
  type: "Layout",
  name: "mainLayout",
  properties: {
    style: { layout: "vertical" },
  },
  children: [
    {
      type: "Header",
      name: "mainHeader",
      properties: {},
      children: [
        {
          type: "Menu",
          name: "mainMenu",
          properties: {
            theme: "dark",
            mode: "horizontal",
            defaultSelectedKeys: ["Browse"],
          },
          onInit: "initMainMenu",
          items: [
            {
              type: "MenuItem",
              name: "browseBooks",
              properties: {
                key: "Browse",
                link: "/browse",
                text: "Browse Books",
              },
            },
            {
              type: "MenuItem",
              name: "userProfile",
              properties: {
                key: "Profile",
                link: "/profile",
                text: "My Profile",
              },
            },
            {
              type: "MenuItem",
              name: "adminPanel",
              properties: {
                key: "Admin",
                link: "/admin",
                text: "Admin Panel",
              },
            },
          ],
        },
      ],
    },
    {
      type: "Content",
      name: "mainContent",
      properties: {
        style: { padding: "24px" },
      },
      children: [
        {
          type: "Routes",
          name: "mainRoutes",
          children: [
            {
              type: "Route",
              name: "homeRoute",
              properties: {
                path: "/browse",
                element: {
                  type: "CustomView",
                  name: "bookListView",
                  properties: {
                    viewName: "BookListView",
                    searchAlgorithm: "Relevance-based search with filters",
                    realTimeAvailabilityUpdate: true,
                  },
                },
              },
            },
            {
              type: "Route",
              name: "browseRoute",
              properties: {
                path: "/browse",
                element: {
                  type: "CustomView",
                  name: "bookListView",
                  properties: {
                    viewName: "BookListView",
                    searchAlgorithm: "Relevance-based search with filters",
                    realTimeAvailabilityUpdate: true,
                  },
                },
              },
            },
            {
              type: "Route",
              name: "profileRoute",
              properties: {
                path: "/profile",
                element: {
                  type: "CustomView",
                  name: "userProfileView",
                  properties: {
                    viewName: "UserProfileView",
                    userWorkflow:
                      "Manage account, write reviews, view order history",
                  },
                },
              },
            },
            {
              type: "Route",
              name: "adminRoute",
              properties: {
                path: "/admin",
                element: {
                  type: "CustomView",
                  name: "adminPanelView",
                  properties: {
                    viewName: "AdminPanelView",
                    managementFunctions:
                      "Catalog management, order processing, user management",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: "Footer",
      name: "mainFooter",
      properties: {
        text: "© 2023 Online Bookstore",
      },
    },
  ],
  customViews: {
    BookListView: {
      type: "Row",
      name: "bookListRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "bookListColumn",
          properties: {
            span: 24,
          },
          children: [
            {
              type: "Search",
              name: "bookSearch",
              properties: {
                placeholder: "Search for books",
                onSearch: "searchBooks",
              },
            },
            {
              type: "Table",
              name: "bookTable",
              objectType: "Book",
              properties: {
                columns: [
                  { title: "Title", dataIndex: "title", key: "title" },
                  {
                    title: "Author",
                    dataIndex: "author",
                    key: "author",
                  },
                  { title: "Price", dataIndex: "price", key: "price" },
                  { title: "ISBN", dataIndex: "isbn", key: "isbn" },
                  { title: "Genre", dataIndex: "genre", key: "genre" },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                  },
                ],
                dataSource: [],
                onRow: { click: "viewBookDetails" },
              },
              onInit: "loadBookData",
            },
          ],
        },
      ],
    },
    UserProfileView: {
      type: "Row",
      name: "userProfileRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "userProfileColumn",
          properties: {
            span: 24,
          },
          children: [
            {
              type: "Form",
              name: "userProfileForm",
              objectType: "UserProfile",
              properties: {
                layout: "vertical",
                onSubmit: "submitUserProfile",
                submitButton: {
                  type: "Button",
                  name: "submitTeamButton",
                  properties: {
                    type: "primary",
                    htmlType: "submit",
                    text: "Submit",
                    name: "submitButton",
                  },
                },
              },
              items: [
                {
                  type: "Input",
                  name: "id",
                  formItemProps: {
                    style: { display: "none" },
                  },
                },
                {
                  type: "Input",
                  name: "name",
                  formItemProps: {
                    label: "Name",
                  },
                },
                {
                  type: "Input",
                  name: "email",
                  formItemProps: {
                    label: "Email",
                  },
                },
                {
                  type: "Input",
                  name: "address",
                  formItemProps: {
                    label: "Address",
                  },
                },
                {
                  type: "Button",
                  name: "saveProfileButton",
                  properties: {
                    type: "primary",
                    htmlType: "submit",
                    text: "Save",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    AdminPanelView: {
      type: "Row",
      name: "adminPanelRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "adminPanelColumn",
          properties: {
            span: 24,
          },
          children: [
            {
              type: "Tabs",
              name: "adminTabs",
              properties: {},
              items: [
                {
                  type: "TabPane",
                  name: "catalogTab",
                  properties: {
                    key: "catalog",
                    label: "Catalog Management",
                  },
                  children: [
                    {
                      type: "CustomView",
                      name: "catalogManagementView",
                      properties: {
                        viewName: "CatalogManagementView",
                      },
                    },
                  ],
                },
                {
                  type: "TabPane",
                  name: "ordersTab",
                  properties: {
                    key: "orders",
                    label: "Order Processing",
                  },
                  children: [
                    {
                      type: "CustomView",
                      name: "orderProcessingView",
                      properties: {
                        viewName: "OrderProcessingView",
                      },
                    },
                  ],
                },
                {
                  type: "TabPane",
                  name: "usersTab",
                  properties: {
                    key: "users",
                    label: "User Management",
                  },
                  children: [
                    {
                      type: "CustomView",
                      name: "userManagementView",
                      properties: {
                        viewName: "UserManagementView",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    CatalogManagementView: {
      type: "Row",
      name: "catalogManagementRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "leftCatalogManagementColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Form",
              name: "bookForm",
              objectType: "Book",
              properties: {
                layout: "vertical",
                onSubmit: "submitBookForm",
                submitButton: {
                  type: "Button",
                  name: "submitTeamButton",
                  properties: {
                    type: "primary",
                    htmlType: "submit",
                    text: "Submit",
                    name: "submitButton",
                  },
                },
              },
              items: [
                {
                  type: "Input",
                  name: "id",
                  formItemProps: {
                    style: { display: "none" },
                  },
                },
                {
                  type: "Input",
                  name: "title",
                  formItemProps: {
                    label: "Title",
                  },
                },
                {
                  type: "Input",
                  name: "author",
                  formItemProps: {
                    label: "Author",
                  },
                },
                {
                  type: "Input",
                  name: "price",
                  formItemProps: {
                    label: "Price",
                  },
                },
                {
                  type: "Input",
                  name: "isbn",
                  formItemProps: {
                    label: "ISBN",
                  },
                },
                {
                  type: "Select",
                  name: "genre",
                  formItemProps: {
                    label: "Genre",
                  },
                },
                {
                  type: "Input",
                  name: "coverImageUrl",
                  formItemProps: {
                    label: "Cover Image URL",
                  },
                },
                {
                  type: "TextArea",
                  name: "description",
                  formItemProps: {
                    label: "Description",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Col",
          name: "rightCatalogManagementColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Table",
              name: "bookTable",
              objectType: "Book",
              properties: {
                columns: [
                  { title: "Title", dataIndex: "title", key: "title" },
                  {
                    title: "Author",
                    dataIndex: "author",
                    key: "author",
                  },
                  { title: "Price", dataIndex: "price", key: "price" },
                  { title: "ISBN", dataIndex: "isbn", key: "isbn" },
                  { title: "Genre", dataIndex: "genre", key: "genre" },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                  },
                  {
                    title: "Cover Image URL",
                    dataIndex: "coverImageUrl",
                    key: "coverImageUrl",
                  },
                  {
                    title: "Rating",
                    dataIndex: "rating",
                    key: "rating",
                  },
                  {
                    title: "Inventory Count",
                    dataIndex: "inventoryCount",
                    key: "inventoryCount",
                  },
                  {
                    title: "Publish Date",
                    dataIndex: "publishDate",
                    key: "publishDate",
                  },
                ],
                dataSource: [],
              },
            },
          ],
        },
      ],
    },
    OrderProcessingView: {
      type: "Row",
      name: "orderProcessingRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "leftOrderProcessingColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Form",
              name: "orderForm",
              objectType: "Order",
              properties: {
                layout: "vertical",
                onSubmit: "submitOrderForm",
                submitButton: {
                  type: "Button",
                  name: "submitTeamButton",
                  properties: {
                    type: "primary",
                    htmlType: "submit",
                    text: "Submit",
                    name: "submitButton",
                  },
                },
              },
              items: [
                {
                  type: "Input",
                  name: "id",
                  formItemProps: {
                    style: { display: "none" },
                  },
                },
                {
                  type: "Input",
                  name: "orderId",
                  formItemProps: {
                    label: "Order ID",
                  },
                },
                {
                  type: "Input",
                  name: "bookId",
                  formItemProps: {
                    label: "Book ID",
                  },
                },
                {
                  type: "Input",
                  name: "userId",
                  formItemProps: {
                    label: "User ID",
                  },
                },
                {
                  type: "InputNumber",
                  name: "quantity",
                  formItemProps: {
                    label: "Quantity",
                  },
                },
                {
                  type: "DatePicker",
                  name: "orderDate",
                  formItemProps: {
                    label: "Order Date",
                  },
                },
                {
                  type: "InputNumber",
                  name: "totalAmount",
                  formItemProps: {
                    label: "Total Amount",
                  },
                },
                {
                  type: "Select",
                  name: "status",
                  formItemProps: {
                    label: "Status",
                  },
                  properties: {
                    options: [
                      { label: "Pending", value: "Pending" },
                      { label: "Completed", value: "Completed" },
                      { label: "Cancelled", value: "Cancelled" },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Col",
          name: "rightOrderProcessingColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Table",
              name: "orderTable",
              objectType: "Order",
              properties: {
                columns: [
                  {
                    title: "Order ID",
                    dataIndex: "orderId",
                    key: "orderId",
                  },
                  {
                    title: "Book ID",
                    dataIndex: "bookId",
                    key: "bookId",
                  },
                  {
                    title: "User ID",
                    dataIndex: "userId",
                    key: "userId",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Order Date",
                    dataIndex: "orderDate",
                    key: "orderDate",
                  },
                  {
                    title: "Total Amount",
                    dataIndex: "totalAmount",
                    key: "totalAmount",
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                  },
                ],
                dataSource: [],
                onRow: { click: "viewOrderDetails" },
              },
              onInit: "loadOrderData",
            },
          ],
        },
      ],
    },
    UserManagementView: {
      type: "Row",
      name: "userManagementRow",
      properties: {
        gutter: 16,
      },
      children: [
        {
          type: "Col",
          name: "leftUserManagementColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Form",
              name: "userForm",
              objectType: "User",
              properties: {
                layout: "vertical",
                onSubmit: "submitUserForm",
                submitButton: {
                  type: "Button",
                  name: "submitTeamButton",
                  properties: {
                    type: "primary",
                    htmlType: "submit",
                    text: "Submit",
                    name: "submitButton",
                  },
                },
              },
              items: [
                {
                  type: "Input",
                  name: "id",
                  formItemProps: {
                    style: { display: "none" },
                  },
                },
                {
                  type: "Input",
                  name: "userId",
                  formItemProps: {
                    label: "User ID",
                  },
                },
                {
                  type: "Input",
                  name: "name",
                  formItemProps: {
                    label: "Name",
                  },
                },
                {
                  type: "Input",
                  name: "email",
                  formItemProps: {
                    label: "Email",
                  },
                },
                {
                  type: "Select",
                  name: "role",
                  formItemProps: {
                    label: "Role",
                  },
                  properties: {
                    options: [
                      { label: "Administrator", value: "Administrator" },
                      {
                        label: "Registered User",
                        value: "RegisteredUser",
                      },
                      { label: "Guest", value: "Guest" },
                    ],
                  },
                },
                {
                  type: "Select",
                  name: "status",
                  formItemProps: {
                    label: "Status",
                  },
                  properties: {
                    options: [
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: "Col",
          name: "rightUserManagementColumn",
          properties: {
            span: 12,
          },
          children: [
            {
              type: "Table",
              name: "userTable",
              objectType: "User",
              properties: {
                columns: [
                  {
                    title: "User ID",
                    dataIndex: "userId",
                    key: "userId",
                  },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Email", dataIndex: "email", key: "email" },
                  { title: "Role", dataIndex: "role", key: "role" },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                  },
                ],
                dataSource: [],
                onRowClick: "viewUserDetails",
              },
              onInit: "loadUserData",
            },
          ],
        },
      ],
    },
  },
  functions: {
    initMainMenu: {
      description:
        "This function is triggered during the initialization of the 'mainMenu' component. It sets the 'selectedKey' of the menu to match the current route if the key exists. This ensures that the correct menu item is highlighted based on the current navigation context, enhancing the user experience by providing visual feedback on the active menu item.",
    },
  },
};
export default bookStore;
