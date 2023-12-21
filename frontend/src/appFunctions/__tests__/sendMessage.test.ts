// sendMessage.test.ts
import { sendMessage } from "../appFunctions";
import { Location } from "react-router-dom";
import AppState from "../../utils/AppState";
import webService from "../../services/webServices";
import { App, Component } from "../../types/types";

jest.mock("../../utils/AppState");
jest.mock("../../services/webServices", () => ({
  ...jest.requireActual("../../services/webServices"),
  getFilesContent: jest.fn(),
  chatWithOpenAI: jest.fn(),
}));

describe("sendMessage", () => {
  let appState: AppState;
  let component: Component;
  let mockApp: App;
  let mockSetAppState: (app: App) => void;
  let mockLocation: Location;

  beforeEach(() => {
    // Mock or create initial App state
    mockApp = {
      // Populate with your App state structure
    } as App;
    mockSetAppState = jest.fn();
    mockLocation = {} as Location; // Mock Location object

    appState = new AppState(mockApp, mockSetAppState, mockLocation);
    component = { name: "messageInput", properties: {} } as Component; // Example component structure

    // Mock implementation of getComponent and changeComponent
    appState.getComponent = jest.fn().mockImplementation((name: string) => {
      if (name === "messageList") {
        return { properties: { dataSource: [] } };
      } else if (name === "fileSelectionTable") {
        return { properties: { rowSelection: { selectedRows: [] } } }; // Mock for no selected files
      }
      return null;
    });
    appState.changeComponent = jest.fn();
  });

  it("should append user message and display chatbot response", async () => {
    // Mock chatWithOpenAI to return a user message followed by a chatbot response
    webService.chatWithOpenAI = jest.fn().mockResolvedValue([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there! How can I help you?" },
    ]);

    // Call sendMessage
    await sendMessage("Hello", appState, component);

    // Assertions
    expect(appState.changeComponent).toHaveBeenCalledWith(
      "messageList",
      expect.any(Object)
    );
    expect(webService.chatWithOpenAI).toHaveBeenCalledWith(expect.any(Array));
  });

  it("should handle errors gracefully", async () => {
    // Mock an error response
    webService.chatWithOpenAI = jest
      .fn()
      .mockRejectedValue(new Error("Network Error"));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, "error");

    // Call sendMessage
    await sendMessage("Hello", appState, component);

    // Assertions
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error in sending message:")
    );
    consoleSpy.mockRestore();
  });

  it("should handle loading state correctly", async () => {
    // Set up mock responses and behavior
    webService.chatWithOpenAI = jest.fn().mockResolvedValue([]);

    // Call sendMessage
    await sendMessage("Test message", appState, component);

    // Assertions for loading state
    expect(appState.changeComponent).toHaveBeenCalledWith("messageInput", {
      loading: true,
      value: "",
    });
    expect(appState.changeComponent).toHaveBeenCalledWith("messageInput", {
      loading: false,
      value: undefined,
    });
  });

  // Test case for file attachment handling (you need to mock getFileContents function or similar logic)
  it("should handle file attachments", async () => {
    // Mock file selection
    appState.getComponent = jest.fn().mockImplementation((name: string) => {
      if (name === "fileSelectionTable") {
        return { properties: { selectedRows: [{ path: "path/to/file.txt" }] } };
      }
      return null;
    });

    // Mock getFileContents behavior
    const mockFileContents = ["Contents of file1.txt", "Contents of file2.txt"];
    webService.getFilesContent = jest.fn().mockResolvedValue(
      mockFileContents.map((content, index) => {
        return { path: `path/to/file${index + 1}.txt`, content };
      })
    );

    // Set up mock responses and behavior for chatWithOpenAI
    webService.chatWithOpenAI = jest.fn().mockResolvedValue([
      { role: "user", content: "Test message with files" },
      // Add other messages or bot responses if needed
    ]);

    // Call sendMessage
    await sendMessage("Test message", appState, component);

    // Assertions for file attachment handling
    // Assertions depend on how you implement file contents retrieval
  });

  // Test case for no file selection
  it("should send message correctly when no files are selected", async () => {
    // Set up mock responses and behavior
    webService.chatWithOpenAI = jest.fn().mockResolvedValue([]);

    // Call sendMessage
    await sendMessage("Test message without files", appState, component);

    // Assertions for message sending without file attachments
    expect(webService.chatWithOpenAI).toHaveBeenCalledWith(expect.any(Array));
    expect(appState.changeComponent).toHaveBeenCalledWith(
      "messageList",
      expect.any(Object)
    );
  });

  // Additional test cases...
});
