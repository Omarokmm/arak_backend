const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    password: {
      type: String,
    },
    confirmPassword: {
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
    photo: {
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

module.exports = mongoose.model("Doctor", doctorSchema);
