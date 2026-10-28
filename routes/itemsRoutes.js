const express = require("express");
const router = express.Router();
const {
  getItems,
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemsController");

// GET active items (used by CadCam technician modal)
router.get("/", getItems);

// GET all items including inactive (admin)
router.get("/all", getAllItems);

// POST create item
router.post("/", createItem);

// PUT update item
router.put("/:id", updateItem);

// DELETE item
router.delete("/:id", deleteItem);

module.exports = router;
