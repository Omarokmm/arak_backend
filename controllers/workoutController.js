const Workout = require("../models/workoutModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
// Get All Workouts

const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({});
  try {
    res.status(responsesStatus.OK).json(workouts);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

// Get Workout By Id
const getWorkoutById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const workout = await Workout.findById(id);
    if (!workout) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Workout!" });
    }
    res.status(responsesStatus.OK).json(workout);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Create new Workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;
  const emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    return res.status(responsesStatus.BadRequest).json({
      error: `Please fill in the following fields: ${emptyFields.join(", ")}`,
      emptyFields,
    });
  }
  // add doc to db
  try {
    const workout = await Workout.create({ title, reps, load });
    res.status(responsesStatus.OK).json(workout);
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Delete Workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const workout = await Workout.findByIdAndDelete({ _id: id });
    if (!workout) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Workout!" });
    }
    res.status(responsesStatus.OK).json(workout);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Update Workout

const updateWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const workout = await Workout.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!workout) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(workout);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  deleteWorkout,
  updateWorkout,
};
