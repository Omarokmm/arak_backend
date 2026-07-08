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
    assignmentDetails: {
      isAssigned: { type: Boolean, default: false },
      assignedToUser: { type: Schema.Types.ObjectId, ref: "User" },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
      assignedByName: { type: String },
      department: { type: String },
      assignedAt: { type: Date }
    },
    assignmentHistory: [{
      assignedToUser: { type: Schema.Types.ObjectId, ref: "User" },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
      assignedByName: { type: String },
      department: { type: String },
      action: { type: String }, // 'assigned'
      timestamp: { type: Date, default: Date.now }
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
