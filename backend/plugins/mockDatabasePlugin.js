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

  writeData({ data }) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 4));
  }

  getAllObjects({ type }) {
    console.log("getAllObjects", type);

    let data = this.readData();
    if (type) data = data[type] ?? [];
    return data;
  }

  createObject({ type, newObject }) {
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
    this.writeData({data});

    // Respond with the new object
    return newObject;
  }

  updateObject({ type, id, updatedObject }) {
    const objectId = parseInt(id);

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      throw new Error("Type not found", { status: 404 });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      throw new Error("Object not found", { status: 404 });
    }

    // Update the object
    data[type][objectIndex] = { ...data[type][objectIndex], ...updatedObject };

    // Write the updated data back to the file
    this.writeData({data});

    // Respond with the updated object
    return data[type][objectIndex];
  }

  deleteObject({ type, id }) {
    const objectId = parseInt(id);

    // Read existing data
    let data = this.readData();
    if (!data[type]) {
      throw new Error("Type not found", { status: 404 });
    }

    // Find the object
    const objectIndex = data[type].findIndex(
      (object) => object.id === objectId
    );
    if (objectIndex === -1) {
      throw new Error("Object not found", { status: 404 });
    }

    // Remove the object
    const [deletedObject] = data[type].splice(objectIndex, 1);

    // Write the updated data back to the file
    this.writeData({data});

    // Respond with the deleted object
    return deletedObject;
  }
}

module.exports = MockDatabasePlugin;
