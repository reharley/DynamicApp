// server.js
const express = require("express");
const cors = require("cors");
const objectRoutes = require("./routes/webService");

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing for all routes

app.use("/api", objectRoutes); // Use the tickets routes for all /api routes

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
