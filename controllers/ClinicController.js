const Clinic = require("../models/ClinicModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
// Get All Clinics
const getClinics = async (req, res) => {
  const clinics = await Clinic.find({});
  try {
    res.status(responsesStatus.OK).json(clinics);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

// Get Clinic By Id
const getClinicById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Clinic!" });
    }
    res.status(responsesStatus.OK).json(clinic);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// // Get Patients of doctor By Id
// const getDoctorsByClinic = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
//     }

//     // Find all cases where dentistObj.id matches the given id
//     const cases = await Case.find({ "dentistObj.id": id });

//     if (!cases.length) {
//       return res.status(responsesStatus.NotFound).json({ error: "No patients found for this doctor!" });
//     }

//     // Extract patient names
//     const patientNames = cases.map(caseObj => ({
//       name: caseObj.patientName,
//       dateIn: caseObj.dateIn
//     }));

//     res.status(responsesStatus.OK).json({ patients: patientNames });
//   } catch (error) {
//     res.status(responsesStatus.BadRequest).json({ error: error.message });
//   }
// };
// Create new Clinic
const createClinic = async (req, res) => {
  const {
    clinicName,
    dentistsIds,
    email,
    phone,
    address: { street, city, state, zipCode, country },
    specialization,
    registrationNumber,
    active,
    notes,
  } = req.body;
  // add clinic to db
  try {

    const clinic = await Clinic.create({
      clinicName,
      dentistsIds,
      email,
      phone,
      address: { street, city, state, zipCode, country },
      specialization,
      registrationNumber,
      active,
      notes,
    });
    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Added Clinic Successfully",
      data: clinic,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Delete Clinic
const deleteClinic = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const clinic = await Clinic.findByIdAndDelete({ _id: id });
    if (!clinic) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Clinic!" });
    }
    res.status(responsesStatus.OK).json(clinic);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Update Clinic
const updateClinic = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const clinic = await Clinic.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!clinic) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(clinic);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
module.exports = {
  getClinics,
  getClinicById,
  createClinic,
  deleteClinic,
  updateClinic
};
