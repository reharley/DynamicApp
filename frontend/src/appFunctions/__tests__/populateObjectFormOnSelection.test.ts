import {
  populateObjectFormOnSelection,
  initializeDateValuesForForm,
} from "../appFunctions";
import dayjs from "dayjs";

jest.mock("dayjs", () => {
  const originalModule = jest.requireActual("dayjs");
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn().mockImplementation((...args) => originalModule(...args)),
  };
});

describe("populateObjectFormOnSelection", () => {
  const mockFormItems = [
    { type: "DatePicker", name: "dateField" },
    // Add more form items as needed
  ];
  const mockForm = {
    formInstance: {
      setFieldsValue: jest.fn(),
    },
    items: mockFormItems,
  };
  const appState = {
    getComponent: jest.fn().mockReturnValue(mockForm),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should populate form with valid record selection", () => {
    const record = { id: "123", dateField: "2020-01-01" };
    const formattedRecord = initializeDateValuesForForm(mockForm, record);
    populateObjectFormOnSelection(record, 0, appState, {
      objectFormName: "mockForm",
    });

    expect(dayjs).toHaveBeenCalledWith(record.dateField);
    expect(appState.getComponent).toHaveBeenCalledWith("mockForm");
    expect(mockForm.formInstance.setFieldsValue).toHaveBeenCalledWith(
      formattedRecord
    );
  });

  it("should not populate form on invalid record selection", () => {
    populateObjectFormOnSelection(null, 0, appState, {
      objectFormName: "mockForm",
    });
    expect(mockForm.formInstance.setFieldsValue).not.toHaveBeenCalled();
  });

  it("should handle error when form or form instance not found", () => {
    appState.getComponent.mockReturnValueOnce(null);
    expect(() =>
      populateObjectFormOnSelection({}, 0, appState, {
        objectFormName: "nonExistentForm",
      })
    ).toThrow("Object form or form instance not found");
  });
});
