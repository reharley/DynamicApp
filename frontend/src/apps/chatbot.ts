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
                  onInit: "fileSelectionInit",
                  properties: {
                    rowSelection: {
                      type: "checkbox",
                      // onChange: "handleFileSelection",
                    },
                    columns: [
                      {
                        title: "Name", // Column header
                        dataIndex: "name", // Field in the data source
                        key: "name", // Unique key for the column
                        onFilter: true, // Enables filtering on this column
                        filterSearch: true, // Enables search on this column
                        sorter: true, // Enables sorting on this column
                      },
                      {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                      },
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
    handleFileSelection: {
      description: `The handleFileSelection function is responsible for managing the user's interaction with the fileSelectionTable. It triggers when the user selects or deselects files within the table. The function captures the selected files' details (such as name, path, and type) and can perform various actions based on this selection, like storing the selected files' information for later use, enabling or disabling UI elements (e.g., download or delete buttons), or initiating further processes like file analysis or processing. This function is vital for ensuring a responsive and interactive user experience in scenarios where file selection and subsequent actions on these files are required.`,
    },
    fileSelectionInit: {
      description:
        "The fileSelectionInit function is designed  populate the fileSelectionTable with files  a specified base directory upon initialization. It fetches a list of files and displays them in a flat list within the table, allowing users to select multiple files. This function ensures that the file selection process is seamless and intuitive, providing users with immediate access to the files they need directly from the base directory.",
    },
    sendMessage: {
      description: `This function is triggered when the 'Send' button is clicked. It not only sends the user's message to the chatbot service but also handles the retrieval of file contents from any files selected in the fileSelectionTable. Once the file contents are received, they are appended to the user's message. The function then updates the 'messageList' with the combined user's message and attached file contents, along with the chatbot's response, ensuring a seamless integration of text and file-based communication in the chat interface.`,
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
