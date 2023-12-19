// onInitMessageListItem.test.js
import { onInitMessageListItem } from "../appFunctions"; // Adjust the import path as needed
import { AppState } from "../../utils/AppState"; // Adjust the import path as needed

describe("onInitMessageListItem", () => {
  let appState;
  let component;

  beforeEach(() => {
    appState = new AppState(); // Mocked AppState
    component = {
      name: "messageListItem",
      properties: {},
    };

    // Mock implementations for AppState
    appState.getComponent = jest.fn().mockImplementation((name) => ({
      name,
      properties: {},
    }));
    appState.setComponentInstance = jest.fn();
  });

  it("initializes with valid data item", () => {
    const mockDataItem = { role: "user", content: "Test message" };
    component.properties.dataItem = mockDataItem;

    onInitMessageListItem(appState, component);

    expect(appState.getComponent).toHaveBeenCalledWith("messageContent");
    expect(appState.getComponent).toHaveBeenCalledWith("listItemAvatar");
    expect(appState.setComponentInstance).toHaveBeenCalledTimes(2);
  });

  it("handles missing data item", () => {
    console.error = jest.fn(); // Mocking console.error

    component.properties.dataItem = null;

    onInitMessageListItem(appState, component);

    expect(console.error).toHaveBeenCalledWith(
      "Data item not found for messageListItem initialization."
    );
  });

  it("sets avatar based on role", () => {
    const roles = ["user", "assistant", "system"];

    roles.forEach((role) => {
      component.properties.dataItem = { role };
      onInitMessageListItem(appState, component);

      expect(appState.getComponent).toHaveBeenCalledWith("listItemAvatar");
      // Assuming avatar icon changes inside the getComponent mock
      const avatarComponent = appState.getComponent("listItemAvatar");
      expect(avatarComponent.properties.icon).toBe(
        role === "system" ? "system" : role
      );
    });
  });
});
