const express = require("express");
const router = express.Router();
const Workout = require("../models/workoutModel");
const responsesStatus = require("../enum/responsesStatus");
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  getAllUsersInDepartment,
  getCasesByDepartment,
} = require("../controllers/DepartmentController");

// Get All Users
router.get("/", getDepartments);

// Get Single User
router.get("/:id", getDepartmentById);

// Get Cases by Departments 
router.get("/casesInDepartment/:departmentName", getCasesByDepartment);

// Get All Users in Departments
router.get("/users-in-departments/:id", getAllUsersInDepartment);

// Create a new User
router.post("/", createDepartment);

// Delete User
router.delete("/:id", deleteDepartment);

// Update User
router.patch("/:id", updateDepartment);
module.exports = router;
