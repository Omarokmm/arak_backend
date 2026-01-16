const express = require("express");
const router = express.Router();
const Workout = require("../models/workoutModel");
const { registerValidator } = require("../helper/validator");
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  changePassword,
  getCasesByUser,
  getCasesAllByUser,
  getCasesByUserCad,
  getCasesByUser2
} = require("../controllers/userController");
// Get All Users
router.get("/", getUsers);
 
// Get Cases by Users 
router.get("/actions/:id", getCasesByUser2);
// Get Single User
router.get("/:id", getUserById);

// Create a new User
router.post("/", registerValidator, createUser);
// login  a  User
// Delete User
router.delete("/:id", deleteUser);
// comment
// Update User
router.patch("/:id", updateUser);
router.put("/change-password", changePassword);
module.exports = router;
