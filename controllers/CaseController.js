const Case = require("../models/CaseModel");
const CounterCase = require("../models/CounterModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// Get All Cases
const getAllCases = async (req, res) => {
  // const cases = await Case.find({});
  const cases = await Case.find({}).sort({ createdAt: -1 });
  try {
    res.status(responsesStatus.OK).json(cases);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

// Get Case By Id
const getCaseById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffCase = await Case.findById(id);
    if (!buffCase) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Case!" });
    }
    res.status(responsesStatus.OK).json(doctor);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Create new case
const createCase = async (req, res) => {
  const {
    name,
    caseType,
    dateIn,
    dateOut,
    dentistObj,
    phone,
    address,
    patientName,
    gender,
    age,
    patientPhone,
    shadeCase,
    occlusalStaining,
    texture,
    translucency,
    jobDescription,
    teethNumbers,
    naturalOfWorks,
    isInvoice,
    isEmail,
    isPhoto,
    isHold,
    photos,
    deadline,
    dateReceived,
    dateReceivedInEmail,
    notes,
    fitting,
    plaster,
    cadCam,
    ceramic,
    qualityControl,
    designing,
    delivering,
    receptionPacking,
    logs,
  } = req.body;
  // add case to db
  try {
    const countCase = await CounterCase.findOne({}).sort({ _id: -1 }); 
    const caseNumber = countCase ? Number(countCase.caseNumber) + 1 : 1;
    const newCase = await Case.create({
      caseNumber,
      name,
      caseType,
      dateIn,
      dateOut,
      dentistObj,
      phone,
      address,
      patientName,
      translucency,
      isHold,
      gender,
      age,
      patientPhone,
      shadeCase,
      occlusalStaining,
      texture,
      jobDescription,
      teethNumbers,
      naturalOfWorks,
      isInvoice,
      isEmail,
      isPhoto,
      photos,
      deadline,
      dateReceived,
      dateReceivedInEmail,
      notes,
      fitting,
      plaster,
      cadCam,
      ceramic,
      designing,
      qualityControl,
      delivering,
      receptionPacking,
      logs,
    });
    const newCaseNumber = await CounterCase.findByIdAndUpdate(
      countCase._id ,
      { caseNumber: caseNumber },
      { new: true }
    );

    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Added Case Successfully",
      data: newCase,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};
// Delete case
const deleteCase = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffCase = await Case.findByIdAndDelete({ _id: id });
    if (!buffCase) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Case!" });
    }
    res.status(responsesStatus.OK).json(buffCase);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Update case
const updateCase = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffCase = await Case.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!buffCase) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(buffCase);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
const updateProcessCase = async (req, res) => {
  const { id, section } = req.params;
  const updateFields = req.body;
    // const updatedActions = [
    //   ...caseData[section].actions,
    //   ...updateFields.actions,
    // ];

 try {
   const updatedCase = await Case.findByIdAndUpdate(
     id,
     {
       $set: {
         [`${section}.actions`]: updateFields.actions,
         [`${section}.namePhase`]: updateFields.namePhase, // Example of updating other attributes
         [`${section}.status`]: updateFields.status, // Example of updating other attributes
         [`${section}.obj`]: updateFields.obj, // Example of updating other attributes
         // Add other attributes as needed
       },
     },
     { new: true }
   );

   if (!updatedCase) {
     res.status(404).json({ message: "Case not found" });
     return;
   }

   res.json(updatedCase);
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Server Error" });
 }
};
const updateIsHoldCase = async (req, res) => {
  const { id, isHold } = req.params;
  const { logs } = req.body;
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
        $set: {
          [`isHold`]: isHold,
          [`logs`]: logs,
        },
      },
      { new: true }
    );

    if (!updatedCase) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  deleteCase,
  updateCase,
  updateProcessCase,
  updateIsHoldCase,
};
