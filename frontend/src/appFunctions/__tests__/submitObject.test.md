## Function Overview: `submitObject`

### Purpose

Handles the submission of an object to the backend. Depending on whether the `values` object contains an `id`, it either updates an existing object or creates a new one.

### Parameters

- `values`: Object containing the data to be submitted.
- `appState`: Application state object for state management.
- `component`: Component object which may contain additional information like `objectType`.

### Behavior

- If `values` contains an `id`, the function updates an existing object.
- If `values` does not contain an `id`, the function creates a new object.
- After a successful submission, the function reloads the object data.
- Handles any errors that occur during the submission process.

## Test Cases for `submitObject`

1. **Create New Object:**

   - Description: Tests if a new object is created when `values` does not contain an `id`.
   - Expectation: `objectService.createObject` is called.

2. **Update Existing Object:**

   - Description: Tests if an existing object is updated when `values` contains an `id`.
   - Expectation: `objectService.updateObject` is called.

3. **Handle Submission Error:**

   - Description: Tests the error handling functionality when submission fails.
   - Expectation: Error handling is triggered.

4. **Successful Submission:**
   - Description: Tests the behavior after a successful submission.
   - Expectation: `appFunctions.loadObjectData` is called.

## Mock Setup

- Mock `objectService.createObject` and `objectService.updateObject` to simulate the backend response.
- Mock `appFunctions.loadObjectData` to verify it is called after successful submission.
- Use Jest's `mockImplementation` to simulate success and error scenarios.
