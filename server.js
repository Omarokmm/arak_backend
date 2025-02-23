require("dotenv").config();
const express = require("express");
const workoutsRoutes = require("./routes/workouts");
const usersRoutes = require("./routes/userRoutes");
const departmentsRoutes = require("./routes/departmentRoutes");
const doctorsRoutes = require("./routes/doctorRoutes");
const clinicsRoutes = require("./routes/clinicsRoutes");
const casesRoutes = require("./routes/casesRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const mongoose = require("mongoose");
const { loginValidator } = require("./helper/validator");
const {
  loginUser
} = require("./controllers/userController");
const PORT = process.env.PORT || 5000;
// express app
const app = express();
const cors = require("cors");

// I3LzBGnpTMMuXFYt Password for DB
// middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.get("/", (req, res) => {
  return res.json({ message: "server is running World!" });
});

// Routes Workouts
app.use("/api/workouts", workoutsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/clinics", clinicsRoutes);
app.use("/api/cases", casesRoutes);
app.use("/api/shipments", shipmentRoutes);
app.post("/login", loginValidator, loginUser);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // listen for requests
    app.listen(PORT, () => {
      console.log("Connecting to db & Listening on port " + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
