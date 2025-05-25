const express = require("express");
const router = express.Router();
const { shipmentValidator } = require("../helper/validator");
const { 
  getAllShipments,
  getShipmentById,
  createShipment,
  deleteShipment,
  updateShipment 
    } = require("../controllers/ShipmentController");

// Get All Shipments
router.get("/", getAllShipments);
 
// Get Single Shipment
router.get("/:id", getShipmentById);

// Create a new Shipment
router.post("/", shipmentValidator, createShipment);

// Delete Shipment
router.delete("/:id", deleteShipment);

// Update Shipment
router.patch("/:id", updateShipment);
module.exports = router;
