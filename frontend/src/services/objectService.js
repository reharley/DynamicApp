// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001";

// Helper function to send requests to the /object endpoint
const sendObjectRequest = async (pluginType, action, objectName, data = {}) => {
  const response = await axios.post(`${baseUrl}/object`, {
    pluginType,
    action,
    params: { type: objectName },
    body: data,
  });
  return response.data;
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectName) => {
  return sendObjectRequest("mock", "getAllObjects", objectName);
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectName, newObject) => {
  return sendObjectRequest("mock", "createObject", objectName, newObject);
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (objectName, id, updatedObject) => {
  return sendObjectRequest("mock", "updateObject", objectName, {
    ...updatedObject,
    id,
  });
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectName, id) => {
  return sendObjectRequest("mock", "deleteObject", objectName, { id });
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
