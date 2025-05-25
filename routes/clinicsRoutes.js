const express = require("express");
const router = express.Router();
const {
  getClinics,
  getClinicById,
  createClinic,
  deleteClinic,
  updateClinic
} = require("../controllers/ClinicController");

// Get All clinic
router.get("/", getClinics);

// Get Single clinic
router.get("/:id", getClinicById);

// Create a new clinic
router.post("/", createClinic);

// Delete clinic
router.delete("/:id", deleteClinic);

// Update clinic
router.patch("/:id", updateClinic);
module.exports = router;
