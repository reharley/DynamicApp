// onInitProjectForm.test.js

import { onInitProjectForm } from "../appFunctions";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("onInitProjectForm", () => {
  it("initializes the form with a UUID", () => {
    // Arrange
    const mockFormInstance = { setFieldsValue: jest.fn() };
    const mockAppState = {
      getComponent: jest
        .fn()
        .mockReturnValue({ formInstance: mockFormInstance }),
    };
    const expectedUUID = "123e4567-e89b-12d3-a456-426614174000";
    uuidv4.mockReturnValue(expectedUUID);

    // Act
    onInitProjectForm(mockAppState, {});

    // Assert
    expect(mockAppState.getComponent).toHaveBeenCalledWith("projectForm");
    expect(uuidv4).toHaveBeenCalled();
    expect(mockFormInstance.setFieldsValue).toHaveBeenCalledWith({
      id: expectedUUID,
    });
  });

  it("handles the case where the form instance is not found", () => {
    // Arrange
    const mockAppState = { getComponent: jest.fn().mockReturnValue(null) };
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Act
    onInitProjectForm(mockAppState, {});

    // Assert
    expect(mockAppState.getComponent).toHaveBeenCalledWith("projectForm");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Project form or form instance not found"
    );

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
