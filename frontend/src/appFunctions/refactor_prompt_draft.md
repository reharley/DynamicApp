You are an expert NodeJS express developer.

Refactor objectService so that it uses the single endpoint provided by objectController.js and mockDatabasePlugin.js.

```javascript
// mockDatabasePlugin.js
const fs = require("fs");

class MockDatabasePlugin {
  constructor() {
    this.dataPath = "./data/data.json";
  }

  readData() {
    const jsonData = fs.readFileSync(this.dataPath);
    return JSON.parse(jsonData);
  }

  writeData(data) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 4));
  }

  getAllObjects(req, res) {
    const type = req.params.type;
    console.log("getAllObjects", type);

    let data = this.readData();
    if (type) data = data[type] ?? [];
    res.json(data);
  }

  createObject(req, res) {
    const type = req.params.type;
    const newObject = req.body; // Assuming the new object data is sent in the request body

    // Read existing data
    const data = this.readData();
    if (!data[type]) data[type] = [];
    const objects = data[type];

    // Generate a new ID for the object
    const newObjectId =
      objects.length > 0 ? objects[objects.length - 1].id + 1 : 1;

    // Add the new object to the data
    newObject.id = newObjectId;
    objects.push(newObject);

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the new object
    res.json(newObject);
  }

  updateObject(req, res) {
    const type = req.params.type;
    const objectId = parseInt(req.params.id);
    const updatedObject = req.body; // Assuming the updated object data is sent in the request body

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      return res.status(404).json({ message: "Object not found" });
    }

    // Update the object
    data[type][objectIndex] = { ...data[type][objectIndex], ...updatedObject };

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the updated object
    res.json(data[type][objectIndex]);
  }

  deleteObject(req, res) {
    const type = req.params.type;
    const objectId = parseInt(req.params.id);

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      return res.status(404).json({ message: "Object not found" });
    }

    // Remove the object
    const [deletedObject] = data[type].splice(objectIndex, 1);

    // Write the updated data back to the file
    this.writeData(data);

    // Respond with the deleted object
    res.json(deletedObject);
  }
}

module.exports = MockDatabasePlugin;
```

```javascript
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

// Single /object endpoint
router.post("/object", (req, res) => {
  const { pluginType, action } = req.body;

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
```

```javascript
// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectName) => {
  const response = await axios.get(`${baseUrl}/objects/${objectName}`);
  return response.data;
};

// Fetches all instances of a specified object type from the server.
const createObject = async (objectName, newObject) => {
  const response = await axios.post(
    `${baseUrl}/objects/${objectName}`,
    newObject
  );
  return response.data;
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (objectName, id, updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/objects/${objectName}/${id}`,
    updatedObject
  );
  return response.data;
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectName, id) => {
  const response = await axios.delete(`${baseUrl}/objects/${objectName}/${id}`);
  return response.data;
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
```
