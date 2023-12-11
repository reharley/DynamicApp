import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getAllObjects = async () => {
  const response = await axios.get(`${baseUrl}/objects`);
  return response.data;
};

const createObject = async (newObject) => {
  const response = await axios.post(`${baseUrl}/objects`, newObject);
  return response.data;
};

const updateObject = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/objects/${id}`, updatedObject);
  return response.data;
};

const deleteObject = async (id) => {
  const response = await axios.delete(`${baseUrl}/objects/${id}`);
  return response.data;
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
};
