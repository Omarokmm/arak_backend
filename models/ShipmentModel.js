
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShipmentSchema = new Schema(
  {
    courierCompany: {
      type: String,
      required: true,
    },
    shippingName: {
      type: String,
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
    },
    shipmentType: {
      type: String,
    },
    sentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    estimatedDeliveryDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    dentistObj: {
      // id: { type: String, required: true },
      // name: { type: String, required: true },
      type: Array,
      default: [],
      required: true 
    },
    status: {
      type: String,
      required: true 
    },
    casesIds: {
        type: Array,
        default: [],
      },
    remarks: {
      type: String,
    },
    notes: {
      type: String,
    },
    logs: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", ShipmentSchema);

