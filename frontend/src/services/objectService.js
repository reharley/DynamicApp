// services/objectService.js
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getAllObjects = async (objectName) => {
  const response = await axios.get(`${baseUrl}/objects/${objectName}`);
  return response.data;
};

const createObject = async (objectName, newObject) => {
  const response = await axios.post(
    `${baseUrl}/objects/${objectName}`,
    newObject
  );
  return response.data;
};

const updateObject = async (objectName, id, updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/objects/${objectName}/${id}`,
    updatedObject
  );
  return response.data;
};

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
