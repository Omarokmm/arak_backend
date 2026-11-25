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
  uploadDeptFiles,
  deleteDeptFile,
} = require("../controllers/DepartmentController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get All Users
router.get("/", getDepartments);

// Get Single User
router.get("/:id", getDepartmentById);

// Get Cases by Departments 
router.get("/casesInDepartment/:departmentName", getCasesByDepartment);

// Get All Users in Departments
router.get("/users-in-departments/:id", getAllUsersInDepartment);

// File uploads
router.post("/upload", upload.array("files"), uploadDeptFiles);

// Delete file
router.post("/deleteFile", deleteDeptFile);

// Create a new User
router.post("/", createDepartment);

// Delete User
router.delete("/:id", deleteDepartment);

// Update User
router.patch("/:id", updateDepartment);
module.exports = router;
