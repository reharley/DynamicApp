import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const getAllTickets = async () => {
  const response = await axios.get(`${baseUrl}/tickets`);
  return response.data;
};

const createTicket = async (newTicket) => {
  const response = await axios.post(`${baseUrl}/tickets`, newTicket);
  return response.data;
};

const updateTicket = async (id, updatedTicket) => {
  const response = await axios.put(`${baseUrl}/tickets/${id}`, updatedTicket);
  return response.data;
};

const deleteTicket = async (id) => {
  const response = await axios.delete(`${baseUrl}/tickets/${id}`);
  return response.data;
};

const getAllTicketTypes = async () => {
  const response = await axios.get(`${baseUrl}/ticket_types`);
  return response.data;
};

const createTicketType = async (newTicketType) => {
  const response = await axios.post(`${baseUrl}/ticket_types`, newTicketType);
  return response.data;
};

const updateTicketType = async (id, updatedTicketType) => {
  const response = await axios.put(
    `${baseUrl}/ticket_types/${id}`,
    updatedTicketType
  );
  return response.data;
};

const deleteTicketType = async (id) => {
  const response = await axios.delete(`${baseUrl}/ticket_types/${id}`);
  return response.data;
};

const getAllTicketWorkflows = async () => {
  const response = await axios.get(`${baseUrl}/ticket_workflows`);
  return response.data;
};

const createTicketWorkflow = async (newTicketWorkflow) => {
  const response = await axios.post(
    `${baseUrl}/ticket_workflows`,
    newTicketWorkflow
  );
  return response.data;
};

const updateTicketWorkflow = async (id, updatedTicketWorkflow) => {
  const response = await axios.put(
    `${baseUrl}/ticket_workflows/${id}`,
    updatedTicketWorkflow
  );
  return response.data;
};

const deleteTicketWorkflow = async (id) => {
  const response = await axios.delete(`${baseUrl}/ticket_workflows/${id}`);
  return response.data;
};

export default {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
  getAllTicketWorkflows,
  createTicketWorkflow,
  updateTicketWorkflow,
  deleteTicketWorkflow,
};
