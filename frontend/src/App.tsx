// App.js
import React from "react";
import DynamicApp from "./components/DynamicApp";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DynamicApp />
    </BrowserRouter>
  );
};

export default App;
