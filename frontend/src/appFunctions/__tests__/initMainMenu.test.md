# Function Overview: `initMainMenu(appState, component)`

## Purpose

Initializes the main menu by setting the selected key based on the current route. This function enhances user experience by visually indicating the active menu item.

## Parameters

- `appState`: The state of the application containing components and routing information.
- `component`: The component that triggered the event (mainMenu in this case).

## Behavior

- Retrieves the `mainMenu` component from `appState`.
- Derives the selected key based on the current route from `appState.location.pathname`.
- Updates the `mainMenu` component's `selectedKeys` if a matching key is found.

## Test Cases

### 1. Valid Route

- **Description:** Provides a valid route and expects the corresponding menu item to be selected.
- **Expectation:** The `selectedKeys` of the `mainMenu` component is updated with the correct key.

### 2. Invalid Route

- **Description:** Provides an invalid route.
- **Expectation:** There is no change in the `selectedKeys` of the `mainMenu` component.

### 3. MainMenu Component Missing

- **Description:** Simulates the `mainMenu` component not being found in `appState`.
- **Expectation:** Error handling is triggered, and no update is made to the `mainMenu`.

## Mock Setup

- `appState.getComponent`: Mocked to return a simulated `mainMenu` component.
- `appState.location.pathname`: Mocked to provide different route scenarios.
- `appState.changeComponent`: Mocked to simulate the updating of the component's state.
