const Case = require("../models/CaseModel");
const CounterCase = require("../models/CounterModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const SEARCH_FIELDS = require("../enum/searchFieldEnum");


// Get All Cases
// asdfasdf
const getAllCases = async (req, res) => {
  // const cases = await Case.find({});
  const cases = await Case.find({}).sort({ createdAt: -1 });
  try {
    res.status(responsesStatus.OK).json(cases);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

const getCounter = async (req, res) => {
  try {
    const data = await CounterCase.find(); // Fetch all documents

    // const transformedData = data.map(transformFields); // Convert only _id, createdAt, updatedAt

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};




// const getCasesByMonth = async (req, res) => {
//   let { year, month } = req.query; // Expecting year and month as query parameters
//   // Default to current year and month if not provided
//   const  currentDate = new Date();
//   year = year || currentDate.getFullYear();
//   month = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to match the typical month numbering
//   try {
//     // Create start and end dates for the specific month
//     const startDate = new Date(year, month - 1, 1); // month is 0-indexed
//     const endDate = new Date(year, month, 1); // First day of the next month

//     // Retrieve cases created within the specified month
//     const cases = await Case.find({
//       createdAt: { $gte: startDate, $lt: endDate } // Filter by date range
//     }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

//     // Respond with the filtered cases
//     res.status(responsesStatus.OK).json({
//       cases:cases,
//       count:cases.length

//     });
//   } catch (error) {
//     console.error(error);
//     res.status(responsesStatus.NotFound).json({ error: "Not Found" });
//   }
// };
// const getCasesByMonth = async (req, res) => {
//   let { year, month, startDate, endDate } = req.query; // Expecting year, month, startDate, and endDate as query parameters

//   // Default to current date if no year and month are provided
//   const currentDate = new Date();
//   year = year || currentDate.getFullYear();
//   month = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to match the typical month numbering

//   // If startDate and endDate are provided, use them as the date range
//   if (startDate && endDate) {
//     try {
//       // Ensure the provided dates are in proper format (YYYY-MM-DD)
//       const parsedStartDate = new Date(startDate);
//       const parsedEndDate = new Date(endDate);

//       if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
//         throw new Error("Invalid date format");
//       }

//       // Set start time to the beginning of the day (00:00:00)
//       parsedStartDate.setHours(0, 0, 0, 0);

//       // Set end time to just before midnight of the next day (23:59:59)
//       parsedEndDate.setHours(23, 59, 59, 999);

//       // Fetch cases between the custom date range
//       const cases = await Case.find({
//         createdAt: { $gte: parsedStartDate, $lt: parsedEndDate },
//       }).sort({ createdAt: -1 });
//       // Holding Cases In All Cases
//       const holdingCases = await Case.find({
//         isHold: true, // Only fetch cases where isHold is true
//         createdAt: { $lt: parsedEndDate }, // Optionally filter by createdAt
//       }).sort({ createdAt: -1 });
//       // Urgent Cases In All Cases
//       const urgentCases = await Case.find({
//         isUrgent: true, // Only fetch cases where isHold is true
//         createdAt: { $lt: parsedEndDate }, // Optionally filter by createdAt
//       }).sort({ createdAt: -1 });
//           // Study Cases In All Cases
//     const studyCases = await Case.find({
//       isStudy: true, // Only fetch cases where isHold is true
//     }).sort({ createdAt: -1 });
//         // Redo Cases In All Cases
//         const redoCases = await Case.find({
//           isRedo: true, // Only fetch cases where isHold is true
//         }).sort({ createdAt: -1 });
//         // Respond with the filtered cases
//       return res.status(responsesStatus.OK).json({
//         cases,
//         holdingCases: holdingCases,
//         urgentCases: urgentCases,
//         studyCases: studyCases,
//         redoCases:redoCases,
//         count: cases.length,
//       });
//     } catch (error) {
//       console.error("Invalid date format:", error);
//       return res
//         .status(responsesStatus.BadRequest)
//         .json({ error: "Invalid date format" });
//     }
//   }

//   // Default behavior: Get cases for a specific month and year
//   try {
//     // Create start date for the 1st day of the month at 00:00:00
//     const startOfMonth = new Date(year, month - 3, 1); // month is 0-indexed, so subtract 1
//     startOfMonth.setHours(0, 0, 0, 0); // Start of the day

//     // Create end date for the last day of the month at 23:59:59.999
//     const endOfMonth = new Date(year, month , 0); // Get last day of the month
//     endOfMonth.setHours(23, 59, 59, 999); // End of the day

//     // Retrieve cases created within the specified month range
//     const cases = await Case.find({
//       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
//     }).sort({ createdAt: -1 });
//     console.log('cases',cases)
//     console.log('startOfMonth',startOfMonth)
//     console.log('endOfMonth',endOfMonth)

//     const holdingCases = await Case.find({
//       isHold: true, // Only fetch cases where isHold is true
//     }).sort({ createdAt: -1 });
//     // Urgent Cases In All Cases
//     const urgentCases = await Case.find({
//       isUrgent: true, // Only fetch cases where isHold is true
//     }).sort({ createdAt: -1 });
//     // Study Cases In All Cases
//     const studyCases = await Case.find({
//       isStudy: true, // Only fetch cases where isHold is true
//     }).sort({ createdAt: -1 });
//     // Redo Cases In All Cases
//     const redoCases = await Case.find({
//       isRedo: true, // Only fetch cases where isHold is true
//     }).sort({ createdAt: -1 });
//     // Respond with the filtered cases
//     return res.status(responsesStatus.OK).json({
//       cases,
//       holdingCases: holdingCases,
//       urgentCases: urgentCases,
//       studyCases: studyCases,
//       redoCases: redoCases,
//       count: cases.length,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(responsesStatus.NotFound).json({ error: "Not Found" });
//   }
// };

const getCasesByMonth = async (req, res) => {
  let { year, month, startDate, endDate } = req.query; // Expecting year, month, startDate, and endDate as query parameters

  // Default to current date if no year and month are provided
  const currentDate = new Date();
  year = year || currentDate.getFullYear();
  month = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to match the typical month numbering

  // If startDate and endDate are provided, use them as the date range
  if (startDate && endDate) {
    try {
      // Ensure the provided dates are in proper format (YYYY-MM-DD)
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        throw new Error("Invalid date format");
      }

      // Set start time to the beginning of the day (00:00:00)
      parsedStartDate.setHours(0, 0, 0, 0);

      // Set end time to just before midnight of the next day (23:59:59)
      parsedEndDate.setHours(23, 59, 59, 999);

      // Fetch cases between the custom date range
      const cases = await Case.find({
        createdAt: { $gte: parsedStartDate, $lt: parsedEndDate },
      }).sort({ createdAt: -1 });
      // Holding Cases In All Cases
      const holdingCases = await Case.find({
        isHold: true, // Only fetch cases where isHold is true
        createdAt: { $lt: parsedEndDate }, // Optionally filter by createdAt
      }).sort({ createdAt: -1 });
      // Urgent Cases In All Cases
      const urgentCases = await Case.find({
        isUrgent: true, // Only fetch cases where isHold is true
        createdAt: { $lt: parsedEndDate }, // Optionally filter by createdAt
      }).sort({ createdAt: -1 });
          // Study Cases In All Cases
    const studyCases = await Case.find({
      isStudy: true, // Only fetch cases where isHold is true
    }).sort({ createdAt: -1 });
        // Redo Cases In All Cases
        const redoCases = await Case.find({
          isRedo: true, // Only fetch cases where isHold is true
        }).sort({ createdAt: -1 });
        // Respond with the filtered cases
      return res.status(responsesStatus.OK).json({
        cases,
        holdingCases: holdingCases,
        urgentCases: urgentCases,
        studyCases: studyCases,
        redoCases:redoCases,
        count: cases.length,
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Invalid date format" });
    }
  }
  // Default behavior: Get cases for a specific month and year
  try {
    // Create start date for the 1st day of the month at 00:00:00
    const startOfMonth = new Date(year, month - 3, 1); // month is 0-indexed, so subtract 1
    startOfMonth.setHours(0, 0, 0, 0); // Start of the day

    // Create end date for the last day of the month at 23:59:59.999
    const endOfMonth = new Date(year, month + 3, 0); // Get last day of the month
    endOfMonth.setHours(23, 59, 59, 999); // End of the day

    // Retrieve cases created within the specified month range
    const cases = await Case.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    }).sort({ createdAt: -1 });



    const holdingCases = await Case.find({
      isHold: true, // Only fetch cases where isHold is true
    }).sort({ createdAt: -1 });
    // Urgent Cases In All Cases
    const urgentCases = await Case.find({
      isUrgent: true, // Only fetch cases where isHold is true
    }).sort({ createdAt: -1 });
    // Study Cases In All Cases
    const studyCases = await Case.find({
      isStudy: true, // Only fetch cases where isHold is true
    }).sort({ createdAt: -1 });
    // Redo Cases In All Cases
    const redoCases = await Case.find({
      isRedo: true, // Only fetch cases where isHold is true
    }).sort({ createdAt: -1 });
    // Respond with the filtered cases
    return res.status(responsesStatus.OK).json({
      cases,
      holdingCases: holdingCases,
      urgentCases: urgentCases,
      studyCases: studyCases,
      redoCases: redoCases,
      count: cases.length,
    });
  } catch (error) {
    console.error(error);
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};



const getCasesByMonthForShipment = async (req, res) => {
  let { year, month, startDate, endDate } = req.query; // Expecting year, month, startDate, and endDate as query parameters

  // Default to current date if no year and month are provided
  const currentDate = new Date();
  year = year || currentDate.getFullYear();
  month = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to match the typical month numbering

  // If startDate and endDate are provided, use them as the date range
  if (startDate && endDate) {
    try {
      // Ensure the provided dates are in proper format (YYYY-MM-DD)
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        throw new Error("Invalid date format");
      }

      // Set start time to the beginning of the day (00:00:00)
      parsedStartDate.setHours(0, 0, 0, 0);

      // Set end time to just before midnight of the next day (23:59:59)
      parsedEndDate.setHours(23, 59, 59, 999);

      // Fetch cases between the custom date range
      const cases = await Case.find({
        createdAt: { $gte: parsedStartDate, $lt: parsedEndDate },
      }).sort({ createdAt: -1 });
    

      // Respond with the filtered cases
      return res.status(responsesStatus.OK).json({
        cases,
      });
    } catch (error) {
      console.error("Invalid date format:", error);
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Invalid date format" });
    }
  }
  // Default behavior: Get cases for a specific month and year
  try {
    // Create start date for the 1st day of the month at 00:00:00
    const startOfMonth = new Date(year, month - 3, 1); // month is 0-indexed, so subtract 1
    startOfMonth.setHours(0, 0, 0, 0); // Start of the day

    // Create end date for the last day of the month at 23:59:59.999
    const endOfMonth = new Date(year, month + 3, 0); // Get last day of the month
    endOfMonth.setHours(23, 59, 59, 999); // End of the day

    // Retrieve cases created within the specified month range
    const cases = await Case.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    }).sort({ createdAt: -1 });

    // Respond with the filtered cases
    return res.status(responsesStatus.OK).json({
      cases
    });
  } catch (error) {
    console.error(error);
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};


const getAllCasesByDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve all cases from the database
    const cases = await Case.find({ "dentistObj.id": id });

    // Filter cases to find those associated with the specified doctor (dentist)
    // const casesFilter = cases.filter(caseItem => caseItem.dentistObj.id == id);

    // Respond with the filtered cases
    res.status(responsesStatus.OK).json(cases);
  } catch (error) {
    // Handle errors, e.g., database errors
    console.error(error);
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
    res.status(responsesStatus.OK).json(buffCase);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Get  Search
const getCaseSearch = async (req, res) => {
  try {
    const { search, searchField } = req.query;

    const query = {};

    // Ensure searchField is a valid enum value
    if (searchField && Object.values(SEARCH_FIELDS).includes(searchField)) {
      // If searchField is valid, construct the query accordingly
      if (search) {
        if (searchField === SEARCH_FIELDS.CASE_NUMBER) {
          query.caseNumber = new RegExp(search, "i");
        } else if (searchField === SEARCH_FIELDS.DOCTOR) {
          query["dentistObj.name"] = new RegExp(search, "i");
        } else if (searchField === SEARCH_FIELDS.PATIENT) {
          query.patientName = new RegExp(search, "i");
        }
      }
    } else if (search) {
      // If no specific searchField is provided, search across all fields (fallback)
      query.$or = [
        { caseNumber: new RegExp(search, "i") },
        { "dentistObj.name": new RegExp(search, "i") },
        { patientName: new RegExp(search, "i") },
      ];
    }

    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for cases" });
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
    isApprove,
    isRedo,
    oldCaseIds,
    redoReason,
    isUrgent,
    isStudy,
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
    historyApproving,
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
      isApprove,
      isUrgent,
      isStudy,
      isRedo,
      oldCaseIds,
      redoReason,
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
      historyApproving,
      logs,
    });
    const newCaseNumber = await CounterCase.findByIdAndUpdate(
      countCase._id,
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
          [`isUrgent`]: updateFields.isUrgent, // Example of updating other attributes
          [`isStudy`]: updateFields.isStudy, // Example of updating other attributes
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
  const buffHistoryHolding = req.body;
  try {
    // First, find the document to check if `historyHolding` exists
    const existingCase = await Case.findById(id);

    if (!existingCase) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      existingCase.historyHolding
        ? {
            $set: {
              ["isHold"]: isHold,
              ["historyHolding"]: req.body,
            },
          }
        : {
            $set: { ["isHold"]: isHold },
            $push: { historyHolding: { $each: buffHistoryHolding } }, // Append new items to existing array
          },
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateIsAprroveCase = async (req, res) => {
  const { id, isApprove } = req.params;
  const buffHistoryApproving = req.body;
  try {
    // First, find the document to check if `historyHolding` exists
    const existingCase = await Case.findById(id);

    if (!existingCase) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      existingCase.historyApproving
        ? {
            $set: {
              ["isApprove"]: isApprove,
              ["historyApproving"]: req.body,
            },
          }
        : {
            $set: { ["isApprove"]: isApprove },
            $push: { historyApproving: { $each: buffHistoryApproving } }, // Append new items to existing array
          },
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateIsUrgentCase = async (req, res) => {
  const { id, isUrgent } = req.params;
  const buffHistoryUrgent = req.body;
  try {
    // First, find the document to check if `historyHolding` exists
    const existingCase = await Case.findById(id);

    if (!existingCase) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      existingCase.historyUrgent
        ? {
            $set: {
              ["isUrgent"]: isUrgent,
              ["historyUrgent"]: req.body,
            },
          }
        : {
            $set: { ["isUrgent"]: isUrgent },
            $push: { historyUrgent: { $each: buffHistoryUrgent } }, // Append new items to existing array
          },
      { new: true }
    );
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
  getAllCasesByDoctor,
  deleteCase,
  updateCase,
  updateProcessCase,
  updateIsHoldCase,
  getCasesByMonth,
  getCaseSearch,
  updateIsUrgentCase,
  getCounter,
  updateIsAprroveCase,
  getCasesByMonthForShipment
};
