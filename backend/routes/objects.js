const express = require("express");
const router = express.Router();
const objectController = require("../controllers/objectController");

// Routes for objects
// Routes for objects
router.get("/objects/", objectController.getAllObjects);
router.get("/objects/:type", objectController.getAllObjects);
router.post("/objects/:type", objectController.createObject);
router.put("/objects/:type/:id", objectController.updateObject);
router.delete("/objects/:type/:id", objectController.deleteObject);

module.exports = router;
