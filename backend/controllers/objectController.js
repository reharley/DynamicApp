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
  const type = req.params.type;
  console.log("getAllObjects", type);

  let data = readData();
  if (type) data = data[type] ?? [];
  console.log("data", data);
  res.json(data);
};

exports.createObject = (req, res) => {
  const type = req.params.type;
  console.log("createObject", type);
  const newObject = req.body; // Assuming the new object data is sent in the request body

  // Read existing data
  const data = readData();
  if (data[type] === undefined) data[type] = [];
  let objects = data[type];

  // Generate a new ID for the object
  const newObjectId =
    objects.length > 0 ? objects[objects.length - 1].id + 1 : 1;

  // Add the new object to the data
  newObject.id = newObjectId;
  objects.push(newObject);

  // Write the updated data back to the file
  writeData(data);

  // Respond with the new object
  res.json(newObject);
};

exports.updateObject = (req, res) => {
  const type = req.params.type;
  console.log("updateObject", type);
  const objectId = req.params.id; // Assuming the object ID is sent as a URL parameter
  const updatedObject = req.body; // Assuming the updated object data is sent in the request body

  // Read existing data
  let data = readData();
  if (type) data = data[type] ?? [];

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
  const type = req.params.type;
  console.log("deleteObject", type);
  const objectId = req.params.id; // Assuming the object ID is sent as a URL parameter

  // Read existing data
  let data = readData();
  if (type) data = data[type] ?? [];

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
