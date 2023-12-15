// objects.js
const express = require("express");
const router = express.Router();

// Assume MockDatabasePlugin and SQLDatabasePlugin are implemented plugins
const MockDatabasePlugin = require("../plugins/mockDatabasePlugin");
const SQLDatabasePlugin = require("../plugins/sqlDatabasePlugin");

// Initialize plugins
const plugins = {
  mock: new MockDatabasePlugin(),
  sql: new SQLDatabasePlugin(),
};

// Single /objects endpoint
router.post("/objects", (req, res) => {
  const { pluginType, action } = req.body;
  console.log("pluginType", pluginType, "action", action);
  // Select the appropriate plugin
  const plugin = plugins[pluginType];
  if (!plugin) {
    return res.status(400).json({ message: "Invalid plugin type" });
  }

  // Execute the action
  try {
    if (typeof plugin[action] === "function") {
      // Call the action method with request and response objects
      plugin[action](req, res);
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
