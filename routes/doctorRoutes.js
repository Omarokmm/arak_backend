const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  deleteDoctor,
  updateDoctor,
} = require("../controllers/doctorController");

// Get All Doctor
router.get("/", getDoctorById);

// Get Single Doctor
router.get("/:id", getDoctorById);

// Create a new Doctor
router.post("/", createDoctor);

// Delete Doctor
router.delete("/:id", deleteDoctor);

// Update Doctor
router.patch("/:id", updateDoctor);
module.exports = router;
