## Function Overview: `initializeDateValuesForForm`

### Purpose

Converts date fields within a record to `dayjs` objects for form initialization, ensuring that date fields are in the correct format for the form component.

### Inputs

- `form`: An object representing the form, containing an `items` array where each item represents a form field.
- `record`: An object representing the record to be loaded into the form, which may contain date fields.

### Output

- Returns a new record object with date fields converted to `dayjs` objects.

### Test Cases

#### 1. Record With Date Fields

- **Description**: The function should convert date string fields to `dayjs` objects when such fields are present in the record.
- **Expectation**: The returned record has all date fields as `dayjs` objects.

#### 2. Record Without Date Fields

- **Description**: If the record does not contain date fields, the function should return the record unchanged.
- **Expectation**: The returned record is identical to the input record.

#### 3. Empty or Invalid Record

- **Description**: When an empty or invalid record is passed, the function should handle it gracefully without throwing errors.
- **Expectation**: The function returns an empty object or handles the invalid input appropriately.

### Mock Setup

- Mock `form.items` to include a mix of date and non-date field types.
- Create sample records with and without date fields.
