// App.js
import React, { useState } from "react";
import DynamicApp from "./components/DynamicApp";
import { useLocation } from "react-router-dom";
import chatbot from "./apps/chatbot";
import AppState from "./utils/AppState";

let appState: AppState;
const App: React.FC = () => {
  const [app, setApp] = useState(chatbot);
  const location = useLocation();
  if (appState === undefined) appState = new AppState(app, setApp, location);
  appState.setState(app, setApp, location);
  return <DynamicApp appState={appState} />;
};

export default App;
