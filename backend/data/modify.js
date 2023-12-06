const fs = require("fs");
const hey = fs.readFileSync("./service_desk_dummy_data.json", "utf8");
console.log("hey", hey);
// Read the data from the file
const data = JSON.parse(
  fs.readFileSync("./service_desk_dummy_data.json", "utf8")
);

// Create a map of ticket types to their IDs
const ticketTypeMap = {};
data.ticket_types.forEach((type) => {
  ticketTypeMap[type.name] = type.id;
});

// Replace the type field in each ticket with the corresponding ID
data.tickets.forEach((ticket) => {
  if (ticket.type in ticketTypeMap) {
    ticket.type = ticketTypeMap[ticket.type];
  } else {
    console.warn(`Unknown ticket type: ${ticket.type}`);
  }
});

// Write the updated data back to the file
fs.writeFileSync("service_desk_dummy_data.json", JSON.stringify(data, null, 2));
