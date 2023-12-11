const fs = require("fs");
const dataPath = "./data/data.json";

// Read data from file
const readData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// Write data to file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
};

// CRUD operations
exports.getAllObjects = (req, res) => {
  console.log("getAllObjects");
  const data = readData();
  res.json(data);
};

exports.createObject = (req, res) => {
  console.log("createObject");
  const newObject = req.body; // Assuming the new object data is sent in the request body

  // Read existing data
  const data = readData();

  // Generate a new ID for the object
  const newObjectId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

  // Add the new object to the data
  newObject.id = newObjectId;
  data.push(newObject);

  // Write the updated data back to the file
  writeData(data);

  // Respond with the new object
  res.json(newObject);
};

exports.updateObject = (req, res) => {
  console.log("updateObject");
  const objectId = req.params.id; // Assuming the object ID is sent as a URL parameter
  const updatedObject = req.body; // Assuming the updated object data is sent in the request body

  // Read existing data
  const data = readData();

  // Find the object with the given ID
  const objectIndex = data.findIndex(
    (object) => object.id === parseInt(objectId)
  );

  if (objectIndex === -1) {
    // If no object with the given ID is found, respond with an error
    res.status(404).json({ message: "Object not found" });
  } else {
    // Update the object
    data[objectIndex] = {
      ...data[objectIndex],
      ...updatedObject,
    };

    // Write the updated data back to the file
    writeData(data);

    // Respond with the updated object
    res.json(data[objectIndex]);
  }
};

exports.deleteObject = (req, res) => {
  console.log("deleteObject");
  const objectId = req.params.id; // Assuming the object ID is sent as a URL parameter

  // Read existing data
  const data = readData();

  // Find the object with the given ID
  const objectIndex = data.findIndex(
    (object) => object.id === parseInt(objectId)
  );

  if (objectIndex === -1) {
    // If no object with the given ID is found, respond with an error
    res.status(404).json({ message: "Object not found" });
  } else {
    // Remove the object
    const deletedObject = data.splice(objectIndex, 1);

    // Write the updated data back to the file
    writeData(data);

    // Respond with the deleted object
    res.json(deletedObject[0]);
  }
};
