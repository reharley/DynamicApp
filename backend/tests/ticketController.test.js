// FILEPATH: /c:/Users/manny/Workspace/jira_clone/backend/tests/ticketController.test.js

const request = require("supertest");
const app = require("../app"); // Import your express app
const {
  getAllTickets,
  createTicket,
} = require("../controllers/ticketController"); // Import your ticketController

describe("Ticket Controller", () => {
  test("getAllTickets should return all tickets", async () => {
    const res = await request(app)
      .get("/tickets") // Assuming '/tickets' is the route for getAllTickets
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test("createTicket should create a new ticket", async () => {
    const newTicket = {
      title: "Test Ticket",
      description: "This is a test ticket",
    };
    const res = await request(app)
      .post("/tickets") // Assuming '/tickets' is the route for createTicket
      .send(newTicket)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body.title).toEqual(newTicket.title);
    expect(res.body.description).toEqual(newTicket.description);
  });
});
