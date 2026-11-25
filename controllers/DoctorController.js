const Doctor = require("../models/DoctorModel");
const Case = require("../models/CaseModel");
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
// Get Patients of doctor By Id
const getPatientsOFDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }

    // Find all cases where dentistObj.id matches the given id
    const cases = await Case.find({ "dentistObj.id": id });

    if (!cases.length) {
      return res.status(responsesStatus.NotFound).json({ error: "No patients found for this doctor!" });
    }

    // Extract patient names
    const patientNames = cases.map(caseObj => ({
      name: caseObj.patientName,
      dateIn: caseObj.dateIn
    }));

    res.status(responsesStatus.OK).json({ patients: patientNames });
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
const User = require("../models/UserModel");

// Assign Doctors to User
const assignDoctorsToUser = async (req, res) => {
  const { userId, department, assignedBy, assignedById, doctorIds, action } = req.body;

  try {
    if (!Array.isArray(doctorIds) || doctorIds.length === 0) {
      return res.status(responsesStatus.BadRequest).json({ error: "No doctors provided" });
    }

    // Handle Unassign Action
    if (action === "unassign") {
      const unassignPromises = doctorIds.map(async (doctorId) => {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.assignmentDetails || !doctor.assignmentDetails.isAssigned) {
          return null; // Already unassigned or not found
        }

        // Use userId from payload if provided, otherwise fallback to doctor's current assignment
        const targetUserId = userId || doctor.assignmentDetails.assignedToUser;

        // 1. Remove from User's assignedDoctors array
        if (targetUserId) {
          await User.findByIdAndUpdate(targetUserId, {
            $pull: { assignedDoctors: { doctorId: doctorId } }
          });
        }

        // 2. Update Doctor status
        return Doctor.findByIdAndUpdate(doctorId, {
          $set: {
            "assignmentDetails.isAssigned": false,
            "assignmentDetails.assignedToUser": null,
            "assignmentDetails.assignedBy": null,
            "assignmentDetails.assignedByName": null,
            "assignmentDetails.department": null,
            "assignmentDetails.assignedAt": null
          },
          $push: {
            assignmentHistory: {
              action: "unassigned",
              timestamp: new Date(),
              assignedBy: assignedById || null,
              assignedByName: assignedBy || "System",
              department: department || doctor.assignmentDetails.department
            }
          }
        });
      });

      await Promise.all(unassignPromises);

      return res.status(responsesStatus.OK).json({
        success: true,
        message: `${doctorIds.length} doctor(s) unassigned successfully.`
      });
    }

    // Handle Assign Action (Default)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(responsesStatus.BadRequest).json({ error: "Invalid User ID" });
    }

    // Fetch user to check existing assignments
    const user = await User.findById(userId);
    if (!user) {
      return res.status(responsesStatus.NotFound).json({ error: "User not found" });
    }

    // Filter out doctorIds that are already in user.assignedDoctors
    const existingDoctorIds = user.assignedDoctors.map(ad => ad.doctorId.toString());
    const newDoctorIds = doctorIds.filter(id => !existingDoctorIds.includes(id.toString()));

    if (newDoctorIds.length === 0) {
      return res.status(responsesStatus.OK).json({ success: true, message: "All doctors are already assigned to this user." });
    }

    // Update User: Add to assignedDoctors
    const userUpdatePromises = newDoctorIds.map(doctorId => {
      return User.findByIdAndUpdate(
        userId,
        {
          $push: {
            assignedDoctors: {
              doctorId: doctorId,
              assignedAt: new Date(),
              assignedBy: assignedById, // Use ID here
              assignedByName: assignedBy, // Use Name here
              department: department
            }
          }
        },
        { new: true }
      );
    });

    await Promise.all(userUpdatePromises);

    // Update Doctors: Status and History
    const doctorUpdatePromises = newDoctorIds.map(async (doctorId) => {
      const doctor = await Doctor.findById(doctorId);

      // Check for reassignment: if already assigned to a DIFFERENT user
      if (doctor.assignmentDetails && doctor.assignmentDetails.isAssigned &&
        doctor.assignmentDetails.assignedToUser &&
        doctor.assignmentDetails.assignedToUser.toString() !== userId.toString()) {

        const previousUserId = doctor.assignmentDetails.assignedToUser;

        // 1. Remove from Previous User's assignedDoctors array
        await User.findByIdAndUpdate(previousUserId, {
          $pull: { assignedDoctors: { doctorId: doctorId } }
        });

        // 2. Log reassignment in history (Optional but recommended)
        await Doctor.findByIdAndUpdate(doctorId, {
          $push: {
            assignmentHistory: {
              action: "reassigned_from_previous_user",
              fromUser: previousUserId,
              toUser: userId,
              timestamp: new Date(),
              assignedBy: assignedById || null,
              assignedByName: assignedBy || "System"
            }
          }
        });
      }

      return Doctor.findByIdAndUpdate(
        doctorId,
        {
          $set: {
            assignmentDetails: {
              isAssigned: true,
              assignedToUser: userId,
              assignedBy: assignedById, // Use ID here
              assignedByName: assignedBy, // Use Name here
              department: department,
              assignedAt: new Date()
            }
          },
          $push: {
            assignmentHistory: {
              assignedToUser: userId,
              assignedBy: assignedById, // Use ID here
              assignedByName: assignedBy, // Use Name here
              department: department,
              action: 'assigned',
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );
    });

    await Promise.all(doctorUpdatePromises);

    res.status(responsesStatus.OK).json({
      success: true,
      message: `${newDoctorIds.length} doctor(s) assigned successfully.`
    });

  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Get doctors assigned to a specific user
const getAssignedDoctors = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(responsesStatus.BadRequest).json({ error: "Invalid User ID" });
    }

    const user = await User.findById(userId).populate({
      path: "assignedDoctors.doctorId",
      model: "Doctor"
    });

    if (!user) {
      return res.status(responsesStatus.NotFound).json({ error: "User not found" });
    }

    // Filter out any populated doctorId that might be null (if doctor was deleted)
    const assignedDoctorsRaw = user.assignedDoctors || [];
    const assignedDoctors = assignedDoctorsRaw
      .filter(ad => ad.doctorId != null)
      .map(ad => ({
        ...ad.toObject(),
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
      }));

    res.status(responsesStatus.OK).json({
      success: true,
      data: assignedDoctors
    });
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
  getPatientsOFDoctor,
  assignDoctorsToUser,
  getAssignedDoctors
};
