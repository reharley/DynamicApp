// appFunctions/__tests__/updateEndDateRestriction.test.js
import * as appFunctions from "../appFunctions";
import dayjs from "dayjs";

describe("appFunctions.updateEndDateRestriction", () => {
  let formMock;

  beforeEach(() => {
    formMock = {
      getFieldValue: jest.fn(),
      setFields: jest.fn(),
    };
  });

  it("should not change end date when it is after start date", () => {
    formMock.getFieldValue.mockImplementation((field) => {
      if (field === "startDate") return dayjs("2023-01-01");
      if (field === "endDate") return dayjs("2023-01-02");
    });

    appFunctions.updateEndDateRestriction(formMock, null, null);
    expect(formMock.setFields).not.toHaveBeenCalledWith([
      { name: "endDate", value: null },
    ]);
  });

  it("should clear end date when it is before start date", () => {
    formMock.getFieldValue.mockImplementation((field) => {
      if (field === "startDate") return dayjs("2023-01-02");
      if (field === "endDate") return dayjs("2023-01-01");
    });

    appFunctions.updateEndDateRestriction(formMock, null, null);
    expect(formMock.setFields).toHaveBeenCalledWith([
      { name: "endDate", value: null },
    ]);
  });

  it("should always disable dates before the start date for end date field", () => {
    const startDate = dayjs("2023-01-01");
    formMock.getFieldValue.mockReturnValueOnce(startDate);

    appFunctions.updateEndDateRestriction(formMock, null, null);

    const disableEndDateFunction =
      formMock.setFields.mock.calls[0][0][0].disabledDate;
    expect(disableEndDateFunction(dayjs("2022-12-31"))).toBeTruthy();
    expect(disableEndDateFunction(dayjs("2023-01-01"))).toBeFalsy();
  });
});
