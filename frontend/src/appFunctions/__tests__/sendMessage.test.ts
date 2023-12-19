// sendMessage.test.ts
import { sendMessage } from "../appFunctions";
import { Location } from "react-router-dom";
import AppState from "../../utils/AppState";
import webService from "../../services/webServices";
import { App, Component } from "../../types/types";

jest.mock("../../utils/AppState");
jest.mock("../../services/webServices");

describe("sendMessage", () => {
  let appState: AppState;
  let component: Component;
  let mockApp: App;
  let mockSetAppState: (app: App) => void;
  let mockLocation: Location;

  beforeEach(() => {
    // Mock or create initial App state
    mockApp = {
      /* ... */
    } as App; // Populate with your App state structure
    mockSetAppState = jest.fn();
    mockLocation = {} as Location; // Mock Location object

    appState = new AppState(mockApp, mockSetAppState, mockLocation);
    component = { name: "messageInput", properties: {} } as Component; // Example component structure

    // Mock implementation of getComponent and changeComponent
    appState.getComponent = jest.fn().mockImplementation((name: string) => {
      if (name === "messageList") {
        return { properties: { dataSource: [] } };
      }
      return null;
    });
    appState.changeComponent = jest.fn();
  });

  it("should append user message and display chatbot response", async () => {
    // Set up mock responses and behavior
    webService.chatWithOpenAI = jest.fn().mockResolvedValue([
      // include mocked response
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

  // Additional test cases...
});
