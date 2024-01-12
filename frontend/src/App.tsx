// App.js
import React, { useState } from "react";
import DynamicApp from "./components/DynamicApp";
import { useLocation } from "react-router-dom";
import chatbot from "./apps/chatbot";
import projectManager from "./apps/projectManager";
import bookstore from "./apps/bookstore";
import AppState from "./utils/AppState";
import { Space } from "antd";

let appState: AppState;
let appState2: AppState;
const App: React.FC = () => {
  const location = useLocation();
  if (appState === undefined) appState = new AppState(chatbot, location);
  if (appState2 === undefined)
    appState2 = new AppState(projectManager, location);
  return (
    <>
      {/* <Space> */}
      <DynamicApp appState={appState} />
      {/* <DynamicApp appState={appState2} /> */}
      {/* </Space> */}
    </>
  );
};

export default App;
