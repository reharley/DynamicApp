// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

// Helper function to send requests to the /object endpoint
const sendObjectRequest = async (
  pluginType: string,
  action: string,
  objectName: string,
  data = {}
) => {
  const response = await axios.post(`${baseUrl}/objects`, {
    pluginType,
    action,
    params: { type: objectName },
    body: data,
  });
  return response.data;
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectName: string) => {
  return sendObjectRequest("mock", "getAllObjects", objectName);
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectName: string, newObject: any) => {
  return sendObjectRequest("mock", "createObject", objectName, newObject);
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (
  objectName: string,
  id: string | number,
  updatedObject: any
) => {
  return sendObjectRequest("mock", "updateObject", objectName, {
    ...updatedObject,
    id,
  });
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectName: string, id: string | number) => {
  return sendObjectRequest("mock", "deleteObject", objectName, { id });
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
