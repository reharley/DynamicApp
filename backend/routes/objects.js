const express = require("express");
const router = express.Router();
const objectController = require("../controllers/objectController");

// Routes for objects
router.get("/objects", objectController.getAllObjects);
router.post("/objects", objectController.createObject);
router.put("/objects/:id", objectController.updateObject);
router.delete("/objects/:id", objectController.deleteObject);

module.exports = router;
