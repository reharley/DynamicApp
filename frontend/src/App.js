import React, { useState, useEffect } from "react";
import TicketManager from "./components/TicketManager";
import TicketTypeManager from "./components/TicketTypeManager";
import ticketService from "./services/ticketService";
import TicketQueue from "./components/TicketQueue";
import DynamicForm from "./components/DynamicForm";

import { buildSchema } from "./utils/schema";

import data from "./data/data.json";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketWorkflows, setTicketWorkflows] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const initialTickets = await ticketService.getAllTickets();
      setTickets(initialTickets);
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      const initialTicketTypes = await ticketService.getAllTicketTypes();
      setTicketTypes(initialTicketTypes);
    };
    fetchTicketTypes();
  }, []);

  useEffect(() => {
    const fetchTicketWorkflows = async () => {
      const initialTicketWorkflows =
        await ticketService.getAllTicketWorkflows();
      setTicketWorkflows(initialTicketWorkflows);
    };
    fetchTicketWorkflows();
  }, []);
  let thing = data;
  console.log(buildSchema(thing), thing);
  return (
    <div>
      <p>this</p>
      <DynamicForm schema={buildSchema(thing)} dataList={thing} />
      <h1>Tickets</h1>
      <TicketManager
        tickets={tickets}
        ticketTypes={ticketTypes}
        setTickets={setTickets}
      />
      <h1>Ticket Types</h1>
      <TicketTypeManager
        tickets={tickets}
        ticketTypes={ticketTypes}
        setTicketTypes={setTicketTypes}
      />
      <h1>Ticket Queues</h1>
      <TicketQueue tickets={tickets} ticketTypes={ticketTypes} />
      <h1>Ticket Workflows</h1>
      {/* <TicketWorkflowList ticketWorkflows={ticketWorkflows} /> */}
    </div>
  );
};

export default App;
