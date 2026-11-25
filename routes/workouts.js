const express = require('express');
const router = express.Router();
const Workout = require("../models/workoutModel");
const responsesStatus = require("../enum/responsesStatus");
const {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    deleteWorkout,
    updateWorkout
} = require("../controllers/workoutController");
// Get All Workouts
router.get("/", getWorkouts);

// Get Single Workout
router.get("/:id", getWorkoutById);

// Create a new workout
router.post('/', createWorkout);

// Delete Workout
router.delete('/:id', deleteWorkout);

// Update Workout
router.patch("/:id", updateWorkout);
module.exports = router;