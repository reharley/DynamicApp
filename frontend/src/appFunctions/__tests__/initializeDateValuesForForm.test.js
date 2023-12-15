// initializeDateValuesForForm.test.js
import { initializeDateValuesForForm } from "../appFunctions";
import dayjs from "dayjs";

describe("initializeDateValuesForForm", () => {
  const mockForm = {
    items: [
      { name: "startDate", type: "DatePicker" },
      { name: "endDate", type: "DatePicker" },
      { name: "name", type: "Input" },
      // Add more form items as needed
    ],
  };

  test("Record with date fields", () => {
    const record = {
      startDate: "2023-01-01",
      endDate: "2023-01-10",
      name: "Test Event",
    };
    const result = initializeDateValuesForForm(mockForm, record);
    expect(dayjs.isDayjs(result.startDate)).toBeTruthy();
    expect(dayjs.isDayjs(result.endDate)).toBeTruthy();
    expect(result.name).toBe(record.name);
  });

  test("Record without date fields", () => {
    const record = {
      name: "Test Event",
      location: "Test Location",
    };
    const result = initializeDateValuesForForm(mockForm, record);
    expect(result).toEqual(record);
  });

  test("Empty or invalid record", () => {
    const record = {};
    const result = initializeDateValuesForForm(mockForm, record);
    expect(result).toEqual({});

    const invalidRecord = null; // or any invalid value
    expect(() =>
      initializeDateValuesForForm(mockForm, invalidRecord)
    ).not.toThrow();
  });
});
