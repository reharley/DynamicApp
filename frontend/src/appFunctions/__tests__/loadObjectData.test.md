# Function Overview: loadObjectData

## Purpose

The `loadObjectData` function asynchronously fetches object data using the `objectService.getAllObjects` method and updates the application state with this data.

## Parameters

- `appState`: The current state of the application.
- `component`: The component triggering this function.

## Expected Behavior

On successful data retrieval, it updates the app state with the new object data. On failure, it logs an error message.

# Test Cases

1. **Successful Data Load**:

   - Description: Simulate a successful data retrieval and expect the app state to be updated with the new data.
   - Expectation: `appState.changeComponent` is called with the correct parameters.

2. **Load Data Error**:
   - Description: Simulate an error during data retrieval and expect error handling to be triggered.
   - Expectation: An error is logged to the console.

# Mock Setup

- Mock `objectService.getAllObjects` to simulate data retrieval.
- Spy on `appState.changeComponent` to check if it is called with the correct arguments.
- Spy on `console.error` to verify error handling.
