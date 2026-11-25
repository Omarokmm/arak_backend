const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clinicSchema = new Schema(
  {
    clinicName: {
      type: String,
    },
    dentistsIds: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    specialization: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clinic", clinicSchema);
