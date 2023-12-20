// services/webServices.ts
import axios from "axios";
import { Message } from "../types/types";

const baseUrl = "http://localhost:3001/api";

// Helper function to send requests to the /webService endpoint
const sendWebServiceRequest = async (
  pluginType: string,
  action: string,
  params: any
) => {
  const response = await axios.post(`${baseUrl}/webService`, {
    pluginType,
    action,
    params,
  });
  return response.data;
};

// Function to interact with the OpenAI plugin
const chatWithOpenAI = async (messages: Message[]) => {
  return sendWebServiceRequest("openai", "chat", { messages });
};

// Fetches all instances of a specified object type from the server.
const getAllObjects = async (objectType: string) => {
  return sendWebServiceRequest("mock", "getAllObjects", { type: objectType });
};

// Function to get the folder structure from the server
const getFolderStructure = async (folderPath?: string) => {
  return sendWebServiceRequest("fs", "getFolderStructure", undefined);
};

// Creates a new instance of a specified object type on the server.
const createObject = async (objectType: string, newObject: any) => {
  return sendWebServiceRequest("mock", "createObject", {
    type: objectType,
    data: newObject,
  });
};

// Updates an existing instance of a specified object type on the server.
const updateObject = async (
  objectType: string,
  id: string | number,
  updatedObject: any
) => {
  return sendWebServiceRequest("mock", "updateObject", {
    type: objectType,
    data: { ...updatedObject, id },
  });
};

// Deletes an instance of a specified object type from the server.
const deleteObject = async (objectType: string, id: string | number) => {
  return sendWebServiceRequest("mock", "deleteObject", {
    type: objectType,
    data: { id },
  });
};

export default {
  getAllObjects,
  createObject,
  updateObject,
  deleteObject,
  chatWithOpenAI,
  getFolderStructure,
};
