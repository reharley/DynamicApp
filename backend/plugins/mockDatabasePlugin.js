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
