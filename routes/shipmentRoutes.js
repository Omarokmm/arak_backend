const express = require("express");
const router = express.Router();
const { shipmentValidator } = require("../helper/validator");
const {
  getAllShipments,
  getShipmentById,
  createShipment,
  deleteShipment,
  updateShipment,
  trackShipmentWithUPS,
  trackShipment
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

// Track Shipment with UPS (legacy endpoint)
router.get("/track/ups/:trackingNumber", trackShipmentWithUPS);

// Track Shipment with any carrier (DHL or UPS)
router.get("/track/:carrier/:trackingNumber", trackShipment);

module.exports = router;
