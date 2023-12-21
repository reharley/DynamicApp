// routes/webService.js
const express = require("express");
const router = express.Router();
const plugins = require("../plugins/index");

// Single /webService endpoint
router.post("/webService", (req, res) => {
  const { pluginType, action, params = {} } = req.body;
  console.log("pluginType", pluginType, "action", action);
  // Select the appropriate plugin
  const plugin = plugins[pluginType];
  if (!plugin) {
    return res.status(400).json({ message: "Invalid plugin type" });
  }

  // Execute the action
  try {
    if (typeof plugin[action] === "function") {
      // Call the action method with request and response webService
      const result = plugin[action](params);
      // If the action returns a promise, wait for it to resolve
      if (result instanceof Promise) {
        result
          .then((data) => res.json(data))
          .catch((error) =>
            res.status(error.status ?? 500).json({ message: error.message })
          );
      } else {
        res.json(result);
      }
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(error.status ?? 500).json({ message: error.message });
  }
});

module.exports = router;
