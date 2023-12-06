const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/ticketController");

// Routes for tickets
router.get("/tickets", ticketsController.getAllTickets);
router.post("/tickets", ticketsController.createTicket);
router.put("/tickets/:id", ticketsController.updateTicket);
router.delete("/tickets/:id", ticketsController.deleteTicket);

// Routes for ticket types
router.get("/ticket_types", ticketsController.getTicketTypes);
router.post("/ticket_types", ticketsController.createTicketType);
router.put("/ticket_types/:id", ticketsController.updateTicketType);
router.delete("/ticket_types/:id", ticketsController.deleteTicketType);

// Routes for ticket workflows
router.get("/ticket_workflows", ticketsController.getTicketWorkflows);
router.post("/ticket_workflows", ticketsController.createTicketWorkflow);
router.put("/ticket_workflows/:id", ticketsController.updateTicketWorkflow);
router.delete("/ticket_workflows/:id", ticketsController.deleteTicketWorkflow);

router.route("/data").all(ticketsController.handleData);

module.exports = router;
