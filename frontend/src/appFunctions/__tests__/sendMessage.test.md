## `sendMessage` Function Overview

**Purpose**: The `sendMessage` function is designed to handle the process of sending a user's message to the chatbot service, updating the chat interface with the user's message, and then displaying the chatbot's response.

**Functionality**:

1. Append the user's message to the current message list.
2. Update the chat interface to reflect the new message.
3. Send the message to the chatbot service and wait for a response.
4. Update the chat interface with the chatbot's response.
5. Handle any errors that might occur during the process.
6. Control the loading state of the send message input field.

**Inputs**:

- `message`: The message string inputted by the user.
- `appState`: An instance of the `AppState` class.
- `component`: The component context.

**Outputs**:

- The function updates the application's state with new messages and handles UI changes accordingly.

## Test Cases for `sendMessage`

1. **Send User Message**: Test if the user's message is correctly appended to the message list and displayed in the chat interface.
2. **Chatbot Response**: Verify if the chatbot's response is properly received and displayed following the user's message.
3. **Error Handling**: Ensure that the function handles errors gracefully, such as network failures or server errors.
4. **Loading State**: Test whether the loading indicator is displayed while the request is in progress and hidden afterwards.
5. **Message Input Clearing**: Check if the message input field is cleared after sending a message.

## Mock Setup for `sendMessage`

- Mock the `appState.getComponent` and `appState.changeComponent` methods to simulate retrieving and updating components in the application state.
- Stub the `webService.chatWithOpenAI` method to simulate the chatbot service's behavior, including sending back a predefined response.
- Spy on console.error to verify error handling.
- Utilize a mock state for the message list to simulate the chat interface's state.
