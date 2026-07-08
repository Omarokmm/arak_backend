const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, required: true },
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    roles: {
      type: [Number],
      default: [0],
      required: true,
    },
    notes: {
      type: Array,
      required: true,
      default: [],
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
      required: true,
    },
    photo: {
      type: String,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    licenseExpireDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    departments: [
      { type: Schema.Types.ObjectId, ref: "Department", required: true },
    ], // Array of section IDs
    active: {
      type: Boolean,
      default: true,
    },
    assignedCases: [{
      caseId: { type: Schema.Types.ObjectId, ref: "Case" },
      department: { type: String },
      assignedAt: { type: Date, default: Date.now },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
      assignedByName: { type: String }
    }],
    assignedDoctors: [{
      doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
      assignedAt: { type: Date, default: Date.now },
      assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
      assignedByName: { type: String },
      department: { type: String }
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
