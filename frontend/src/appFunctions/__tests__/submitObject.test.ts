// submitObject.test.js
import { submitObject } from "../appFunctions";
import objectService from "../../services/webServices";

jest.mock("../../services/objectService", () => ({
  createObject: jest.fn(),
  updateObject: jest.fn(),
}));

describe("submitObject", () => {
  const mockAppState = {};
  const mockComponent = { objectType: "TestObject" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new object if id is not present", async () => {
    const values = { name: "New Object" };
    objectService.createObject.mockResolvedValue();

    await submitObject(values, mockAppState, mockComponent);

    expect(objectService.createObject).toHaveBeenCalledWith(
      mockComponent.objectType,
      values
    );
  });

  it("updates an existing object if id is present", async () => {
    const values = { id: "123", name: "Existing Object" };
    objectService.updateObject.mockResolvedValue();

    await submitObject(values, mockAppState, mockComponent);

    expect(objectService.updateObject).toHaveBeenCalledWith(
      mockComponent.objectType,
      values.id,
      values
    );
  });

  it("handles submission error", async () => {
    const values = { name: "New Object" };
    const error = new Error("Test error");
    objectService.createObject.mockRejectedValue(error);
    console.error = jest.fn(); // Mock console.error for testing

    await submitObject(values, mockAppState, mockComponent);

    expect(console.error).toHaveBeenCalledWith(
      `Error submitting TestObject:`,
      error
    );
  });
});
