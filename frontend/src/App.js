import React, { useState, useEffect } from "react";
import DynamicApp from "./components/DynamicApp";

import { BrowserRouter } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <DynamicApp />
    </BrowserRouter>
  );
};

export default App;
