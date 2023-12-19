import { loadObjectData } from "../appFunctions";
import objectService from "../../services/objectService";

// Mock the objectService
jest.mock("../../services/objectService", () => ({
  getAllObjects: jest.fn(),
}));

describe("loadObjectData", () => {
  let mockAppState;
  let mockComponent;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock appState and component
    mockAppState = {
      changeComponent: jest.fn(),
      location: {
        pathname: "/test-path",
      },
    };
    mockComponent = {
      objectType: "TestObject",
      name: "TestComponent",
    };
  });

  it("should successfully load data and update app state", async () => {
    // Arrange
    const mockData = [{ id: 1, name: "Test Object" }];
    objectService.getAllObjects.mockResolvedValue(mockData);

    // Act
    await loadObjectData(mockAppState, mockComponent);

    // Assert
    expect(objectService.getAllObjects).toHaveBeenCalledWith("TestObject");
    expect(mockAppState.changeComponent).toHaveBeenCalledWith(
      mockComponent.name,
      { dataSource: mockData }
    );
  });

  it("should handle errors when data loading fails", async () => {
    // Arrange
    const error = new Error("Failed to load data");
    objectService.getAllObjects.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, "error");

    // Act
    await loadObjectData(mockAppState, mockComponent);

    // Assert
    expect(objectService.getAllObjects).toHaveBeenCalledWith("TestObject");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading project data:",
      error
    );
  });
});
