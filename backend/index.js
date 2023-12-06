const express = require("express");
const cors = require("cors");
const ticketsRoutes = require("./routes/tickets");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing for all routes

app.use("/api", ticketsRoutes); // Use the tickets routes for all /api routes

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
