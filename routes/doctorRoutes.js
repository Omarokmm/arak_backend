const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  deleteDoctor,
  updateDoctor,
  getPatientsOFDoctor,
  assignDoctorsToUser,
  getAssignedDoctors
} = require("../controllers/DoctorController");
const { getAllCasesByDoctor } = require("../controllers/CaseController");

// Get All Doctor
router.get("/", getDoctors);

// Get All Cases By  Doctor
router.get("/casesbydoctor/:id", getAllCasesByDoctor);

// Get Single Doctor
router.get("/:id", getDoctorById);
router.get("/patients/:id", getPatientsOFDoctor);

// Create a new Doctor
router.post("/", createDoctor);

// Assign Doctors to User
router.post("/assign-doctors", assignDoctorsToUser);

// Get Assigned Doctors by User ID
router.get("/assigned/:userId", getAssignedDoctors);

// Delete Doctor
router.delete("/:id", deleteDoctor);

// Update Doctor
router.patch("/:id", updateDoctor);
module.exports = router;
