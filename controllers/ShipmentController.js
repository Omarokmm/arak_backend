const Shipment = require("../models/ShipmentModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// Get All Shipments
const getAllShipments = async (req, res) => {
  const shipments = await Shipment.find({}).sort({ createdAt: -1 });
  try {
    res.status(responsesStatus.OK).json(shipments);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};


// Get shipment By Id
const getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findById(id);
    if (!buffShipment) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Shipment!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Create new shipment
const createShipment= async (req, res) => {
  const {
    courierCompany,
    shippingName,
    trackingNumber,
    shipmentType,
    sentDate,
    estimatedDeliveryDate,
    deliveryDate,
    dentistObj,
    status,
    casesIds,
    remarks,
    notes,
    logs,
  } = req.body;
  // add shipment to db
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }
    const isExistShipment = await Shipment.findOne({trackingNumber}) 
    if(isExistShipment){
       return res.status(responsesStatus.BadRequest).json({
         success: false,
         msg: "TrackingNumber is Exist",
       });
    }
    const newShipment = await Shipment.create({
      courierCompany,  
      shippingName,
      trackingNumber,
      shipmentType,
      sentDate,
      estimatedDeliveryDate,
      deliveryDate,
      dentistObj,
      status,
      casesIds,
      remarks,
      notes,
      logs,
    });
    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Added Shipment Successfully",
      data: newShipment,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};
// Delete shipment
const deleteShipment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findByIdAndDelete({ _id: id });
    if (!buffShipment) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Shipment!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Update shipment
const updateShipment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!buffShipment) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  createShipment,
  deleteShipment,
  updateShipment,
};
