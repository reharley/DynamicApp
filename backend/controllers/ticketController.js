const fs = require("fs");
const dataPath = "./data/service_desk_dummy_data.json";

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
exports.getAllTickets = (req, res) => {
  const data = readData();
  res.json(data.tickets);
};

exports.createTicket = (req, res) => {
  const newTicket = req.body; // Assuming the new ticket data is sent in the request body

  // Read existing data
  const data = readData();

  // Generate a new ID for the ticket
  const newTicketId =
    data.tickets.length > 0 ? data.tickets[data.tickets.length - 1].id + 1 : 1;

  // Add the new ticket to the data
  newTicket.id = newTicketId;
  data.tickets.push(newTicket);

  // Write the updated data back to the file
  writeData(data);

  // Respond with the new ticket
  res.json(newTicket);
};

exports.updateTicket = (req, res) => {
  const ticketId = req.params.id; // Assuming the ticket ID is sent as a URL parameter
  const updatedTicket = req.body; // Assuming the updated ticket data is sent in the request body

  // Read existing data
  const data = readData();

  // Find the ticket with the given ID
  const ticketIndex = data.tickets.findIndex(
    (ticket) => ticket.id === parseInt(ticketId)
  );

  if (ticketIndex === -1) {
    // If no ticket with the given ID is found, respond with an error
    res.status(404).json({ message: "Ticket not found" });
  } else {
    // Update the ticket
    data.tickets[ticketIndex] = {
      ...data.tickets[ticketIndex],
      ...updatedTicket,
    };

    // Write the updated data back to the file
    writeData(data);

    // Respond with the updated ticket
    res.json(data.tickets[ticketIndex]);
  }
};

exports.deleteTicket = (req, res) => {
  const ticketId = req.params.id; // Assuming the ticket ID is sent as a URL parameter

  // Read existing data
  const data = readData();

  // Find the ticket with the given ID
  const ticketIndex = data.tickets.findIndex(
    (ticket) => ticket.id === parseInt(ticketId)
  );

  if (ticketIndex === -1) {
    // If no ticket with the given ID is found, respond with an error
    res.status(404).json({ message: "Ticket not found" });
  } else {
    // Remove the ticket
    const deletedTicket = data.tickets.splice(ticketIndex, 1);

    // Write the updated data back to the file
    writeData(data);

    // Respond with the deleted ticket
    res.json(deletedTicket[0]);
  }
};

exports.getTicketTypes = (req, res) => {
  const data = readData();
  res.json(data.ticket_types);
};

exports.createTicketType = (req, res) => {
  const data = readData();
  const newTicketType = { id: data.ticket_types.length + 1, ...req.body };
  data.ticket_types.push(newTicketType);
  writeData(data);
  res.json(newTicketType);
};

exports.updateTicketType = (req, res) => {
  const data = readData();
  const ticketTypeId = parseInt(req.params.id);
  const ticketTypeIndex = data.ticket_types.findIndex(
    (ticketType) => ticketType.id === ticketTypeId
  );
  if (ticketTypeIndex === -1) {
    res.status(404).json({ message: "Ticket type not found" });
  } else {
    data.ticket_types[ticketTypeIndex] = {
      ...data.ticket_types[ticketTypeIndex],
      ...req.body,
    };
    writeData(data);
    res.json(data.ticket_types[ticketTypeIndex]);
  }
};

exports.deleteTicketType = (req, res) => {
  const data = readData();
  const ticketTypeId = parseInt(req.params.id);
  const ticketTypeIndex = data.ticket_types.findIndex(
    (ticketType) => ticketType.id === ticketTypeId
  );
  if (ticketTypeIndex === -1) {
    res.status(404).json({ message: "Ticket type not found" });
  } else {
    const deletedTicketType = data.ticket_types.splice(ticketTypeIndex, 1);
    writeData(data);
    res.json(deletedTicketType[0]);
  }
};

exports.getTicketWorkflows = (req, res) => {
  const data = readData();
  res.json(data.ticket_workflows);
};

exports.handleData = (req, res) => {
  const dataPath = "./data/data.json";
  if (req.method === "GET") {
    const data = fs.readFileSync(dataPath);
    res.json(JSON.parse(data));
  } else if (req.method === "POST") {
    fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 4));
    res.json({ message: "Data saved successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

exports.createTicketWorkflow = (req, res) => {
  const data = readData();
  const newTicketWorkflow = {
    id: data.ticket_workflows.length + 1,
    ...req.body,
  };
  data.ticket_workflows.push(newTicketWorkflow);
  writeData(data);
  res.json(newTicketWorkflow);
};

exports.updateTicketWorkflow = (req, res) => {
  const data = readData();
  const ticketWorkflowId = parseInt(req.params.id);
  const ticketWorkflowIndex = data.ticket_workflows.findIndex(
    (ticketWorkflow) => ticketWorkflow.id === ticketWorkflowId
  );
  if (ticketWorkflowIndex === -1) {
    res.status(404).json({ message: "Ticket workflow not found" });
  } else {
    data.ticket_workflows[ticketWorkflowIndex] = {
      ...data.ticket_workflows[ticketWorkflowIndex],
      ...req.body,
    };
    writeData(data);
    res.json(data.ticket_workflows[ticketWorkflowIndex]);
  }
};

exports.deleteTicketWorkflow = (req, res) => {
  const data = readData();
  const ticketWorkflowId = parseInt(req.params.id);
  const ticketWorkflowIndex = data.ticket_workflows.findIndex(
    (ticketWorkflow) => ticketWorkflow.id === ticketWorkflowId
  );
  if (ticketWorkflowIndex === -1) {
    res.status(404).json({ message: "Ticket workflow not found" });
  } else {
    const deletedTicketWorkflow = data.ticket_workflows.splice(
      ticketWorkflowIndex,
      1
    );
    writeData(data);
    res.json(deletedTicketWorkflow[0]);
  }
};
