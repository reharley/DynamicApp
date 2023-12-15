### Function Overview

## Function: populateObjectFormOnSelection

**Purpose**: To populate a form with data from a selected record in a table or list view.

**Inputs**:

- `record`: The data record selected.
- `rowIndex`: The index of the selected row.
- `appState`: The current state of the application, containing various components.
- `component`: The component from which this function is called.

**Expected Output**: The form specified in the `appState` is populated with data from the `record`.

### Test Cases

### Test Cases for populateObjectFormOnSelection

1. **Valid Record Selection**

   - **Description**: Selecting a valid record should populate the form with the record's details.
   - **Expectation**: The form's `setFieldsValue` method is called with the formatted record data.

2. **Invalid Record Selection**

   - **Description**: Selecting an invalid record or no record should not update the form.
   - **Expectation**: No call is made to the form's `setFieldsValue` method.

3. **Form or Form Instance Not Found**
   - **Description**: If the object form or form instance is not found in the app state.
   - **Expectation**: Error handling is triggered, and no attempt to set form values is made.

### Mock Setup Description

### Mock Setup for Testing populateObjectFormOnSelection

- **Mock appState**: Create a mock of the `appState` object with a method `getComponent` that returns a mock form object.
- **Mock form**: The form object should include a `formInstance` with a method `setFieldsValue`.
- **Mock record**: Create a sample record object that would represent a row in a table or list.
- **Spy**: Set up spies on the `setFieldsValue` method of the form instance to monitor its calls and arguments.

This test file uses Jest for unit testing. It includes mocks for `appState`, the form object, and spies on the `setFieldsValue` method. The tests cover the three main scenarios outlined in the test cases.
