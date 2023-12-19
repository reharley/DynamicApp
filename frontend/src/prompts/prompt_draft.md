Update services/webService.ts so that i t uses the new openAiPlugin similar to the MockDatabasePlugin in webService.js

```javascript
// webService.js
const express = require("express");
const router = express.Router();

// Assume MockDatabasePlugin and SQLDatabasePlugin are implemented plugins
const MockDatabasePlugin = require("../plugins/mockDatabasePlugin");
const SQLDatabasePlugin = require("../plugins/sqlDatabasePlugin");
const OpenAIPlugin = require("../plugins/openAiPlugin");

// Initialize plugins
const plugins = {
  mock: new MockDatabasePlugin(),
  sql: new SQLDatabasePlugin(),
  openai: new OpenAIPlugin(),
};

// Single /webService endpoint
router.post("/webService", (req, res) => {
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
      // Call the action method with request and response webService
      plugin[action](req, res);
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

```javascript
// openAiPlugin.js
const OpenAI = require("openai");

class OpenAIPlugin {
  constructor() {
    // Initialize OpenAI API with your API key
    this.openai = new OpenAI();
  }

  async chat(req, res) {
    const { messages } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages,
      });

      messages.push({
        role: "assistant",
        content: completion.choices[0].message,
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = OpenAIPlugin;
```

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
    const type = req.body.params.type;
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
// server.js
const express = require("express");
const cors = require("cors");
const objectRoutes = require("./routes/webService");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing for all routes

app.use("/api", objectRoutes); // Use the tickets routes for all /api routes

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

```typescript
// services/webService.ts
import axios from "axios";
import { Messages } from "../types/types";

const baseUrl = "http://localhost:3001/api";

// Helper function to send requests to the /webService endpoint
const sendWebServiceRequest = async (
  pluginType: string,
  action: string,
  params: any,
  data = {}
) => {
  const response = await axios.post(`${baseUrl}/webService`, {
    pluginType,
    action,
    params,
    body: data,
  });
  return response.data;
};

// Function to interact with the OpenAI plugin
const chatWithOpenAI = async (messages: Messages) => {
  return sendWebServiceRequest("openai", "chat", { messages });
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectType: string) => {
  return sendWebServiceRequest("mock", "getAllObjects", { type: objectType });
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectType: string, newObject: any) => {
  return sendWebServiceRequest(
    "mock",
    "createObject",
    { type: objectType },
    newObject
  );
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (
  objectType: string,
  id: string | number,
  updatedObject: any
) => {
  return sendWebServiceRequest(
    "mock",
    "updateObject",
    { type: objectType },
    { ...updatedObject, id }
  );
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectType: string, id: string | number) => {
  return sendWebServiceRequest(
    "mock",
    "deleteObject",
    { type: objectType },
    { id }
  );
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
  chatWithOpenAI,
};
```
