const Doctor = require("../models/DoctorModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Get All Doctors
const getDoctors = async (req, res) => {
  const doctors = await Doctor.find({});
  try {
    res.status(responsesStatus.OK).json(doctors);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

// Get doctor By Id
const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Doctor!" });
    }
    res.status(responsesStatus.OK).json(doctor);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Create new doctor
const createDoctor = async (req, res) => {
  const {
    firstName,
    lastName,
    clinicName,
    email,
    phone,
    gender,
    address: { street, city, state, zipCode, country },
    password,
    confirmPassword,
    specialization,
    registrationNumber,
    photo,
    active,
    notes,
  } = req.body;
  // add doctor to db
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(responsesStatus.BadRequest).json({
    //     success: false,
    //     msg: "Error",
    //     errors: errors.array(),
    //   });
    // }
    // const isExistDoctor = await Doctor.findOne({ email });
    // if (isExistDoctor) {
    //   return res.status(responsesStatus.BadRequest).json({
    //     success: false,
    //     msg: "Email is Exist",
    //   });
    // }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    const doctor = await Doctor.create({
      firstName,
      lastName,
      clinicName,
      email,
      phone,
      gender,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
      specialization,
      registrationNumber,
      photo,
      active,
      notes,
    });
    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Added Doctor Successfully",
      data: doctor,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const doctor = await Doctor.findByIdAndDelete({ _id: id });
    if (!doctor) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Doctor!" });
    }
    res.status(responsesStatus.OK).json(doctor);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Update doctor
const updateDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!doctor) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(doctor);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  deleteDoctor,
  updateDoctor,
};
