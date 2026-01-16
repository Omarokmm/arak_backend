const Case = require("../models/CaseModel");
const CounterCase = require("../models/CounterModel");
const User = require("../models/UserModel");
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
      // const cases  = await Case.find({
      //   $expr: { $lte: [{ $size: "$delivering.actions" }, 0] }
      // }).sort({ createdAt: -1 });

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
        redoCases: redoCases,
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
    // const cases = await Case.find({
    //   createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    // }).sort({ createdAt: -1 });


    const cases = await Case.find({
      $expr: { $lte: [{ $size: "$delivering.actions" }, 0] }
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

    // Find the case first to check assignments
    const existingCase = await Case.findById(id);
    if (!existingCase) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Case!" });
    }

    // Check if assigned to CADCAM and remove from user assignments
    if (existingCase.isAssignedCadCam) {
      const caseObjectId = existingCase._id;
      const departmentRegex = /^cadcam$/i;

      // Search for any user who has this case assigned in cadcam
      const assignedUser = await User.findOne({
        assignedCases: {
          $elemMatch: {
            caseId: caseObjectId,
            department: { $regex: departmentRegex }
          }
        }
      });

      if (assignedUser) {
        await User.findByIdAndUpdate(assignedUser._id, {
          $pull: {
            assignedCases: {
              caseId: caseObjectId,
              department: { $regex: departmentRegex }
            }
          }
        });
        console.log(`Removed case assignment from user ${assignedUser._id} before deletion`);
      }
    }

    // Now delete the case
    const buffCase = await Case.findByIdAndDelete({ _id: id });

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
    // Check if this is a CADCAM section and the action is ending
    const isCadcamEnd = section.toLowerCase() === 'cadcam' &&
      updateFields.status &&
      updateFields.status.isEnd === true;

    let updateQuery = {
      $set: {
        [`${section}.actions`]: updateFields.actions,
        [`${section}.namePhase`]: updateFields.namePhase, // Example of updating other attributes
        [`${section}.status`]: updateFields.status, // Example of updating other attributes
        [`${section}.obj`]: updateFields.obj, // Example of updating other attributes
        [`isUrgent`]: updateFields.isUrgent, // Example of updating other attributes
        [`isStudy`]: updateFields.isStudy, // Example of updating other attributes
        // Add other attributes as needed
      },
    };

    // If CADCAM case is ending, set isAssignedCadCam to false
    if (isCadcamEnd) {
      updateQuery.$set.isAssignedCadCam = false;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    );

    if (!updatedCase) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    // If CADCAM case is ending, remove the case from assignedCases for the specific technician
    if (isCadcamEnd && updateFields.actions && updateFields.actions.length > 0) {
      try {
        // Get the technicianId from the last action item
        const lastAction = updateFields.actions[updateFields.actions.length - 1];
        const technicianId = lastAction.technicianId;



        if (technicianId) {


          // Convert id to ObjectId for proper matching
          const caseObjectId = mongoose.Types.ObjectId.createFromHexString(id);
          const departmentRegex = /^cadcam$/i;

          // 1. First search in the specific technician's assignedCases
          const userHasCase = await User.findOne({
            _id: technicianId,
            assignedCases: {
              $elemMatch: {
                caseId: caseObjectId,
                department: { $regex: departmentRegex }
              }
            }
          });

          if (userHasCase) {
            // Find and remove from the specific technician
            await User.findByIdAndUpdate(technicianId, {
              $pull: {
                assignedCases: {
                  caseId: caseObjectId,
                  department: { $regex: departmentRegex }
                }
              }
            });
            console.log(`Case ${id} removed from technician ${technicianId}`);
          } else {
            // 2. If not found, search in other users and remove it
            const otherUser = await User.findOne({
              assignedCases: {
                $elemMatch: {
                  caseId: caseObjectId,
                  department: { $regex: departmentRegex }
                }
              }
            });

            if (otherUser) {
              await User.findByIdAndUpdate(otherUser._id, {
                $pull: {
                  assignedCases: {
                    caseId: caseObjectId,
                    department: { $regex: departmentRegex }
                  }
                }
              });
              console.log(`Case ${id} found and removed from other user ${otherUser._id}`);
            } else {
              console.log(`Case ${id} was not found assigned to any user in CADCAM department`);
            }
          }

        } else {
          console.log('No technicianId found in the last action item');
        }
      } catch (userUpdateError) {
        console.error('Error removing case from user assignedCases:', userUpdateError);
        // Don't fail the main operation if user update fails
      }
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

// Assign cases to users based on departments (supports reassignment and unassignment)
const assignCasesToUsers = async (req, res) => {
  try {
    let { caseIds, assignments, assignedBy, assignedByName, assignedAt, action = 'assign' } = req.body;
    console.log("caseIds assignments assignedBy assignedByName assignedAt action", caseIds, assignments, assignedBy, assignedByName, assignedAt, action);
    // Validate required fields
    if (!caseIds || !Array.isArray(caseIds) || caseIds.length === 0) {
      return res.status(responsesStatus.BadRequest).json({
        error: "caseIds is required and must be a non-empty array"
      });
    }

    if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
      return res.status(responsesStatus.BadRequest).json({
        error: "assignments is required and must be a non-empty array"
      });
    }

    if (!assignedBy || !assignedByName) {
      return res.status(responsesStatus.BadRequest).json({
        error: "assignedBy and assignedByName are required"
      });
    }

    // Normalize action
    if (typeof action === 'string') {
      action = action.toLowerCase().trim();
    }

    // Validate action type
    if (!['assign', 'reassign', 'unassign'].includes(action)) {
      return res.status(responsesStatus.BadRequest).json({
        error: "action must be one of: assign, reassign, unassign"
      });
    }

    // Validate all case IDs
    const validCaseIds = caseIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validCaseIds.length !== caseIds.length) {
      return res.status(responsesStatus.BadRequest).json({
        error: "Some case IDs are invalid"
      });
    }

    // Check if all cases exist
    const existingCases = await Case.find({ _id: { $in: validCaseIds } });
    if (existingCases.length !== validCaseIds.length) {
      return res.status(responsesStatus.NotFound).json({
        error: "Some cases not found"
      });
    }

    // For unassign action, userId can be null
    if (action !== 'unassign') {
      // Validate all user IDs in assignments
      const userIds = assignments.map(assignment => assignment.userId).filter(id => id !== null);
      const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      if (validUserIds.length !== userIds.length) {
        return res.status(responsesStatus.BadRequest).json({
          error: "Some user IDs in assignments are invalid"
        });
      }

      // Check if all users exist
      const existingUsers = await User.find({ _id: { $in: validUserIds } });
      if (existingUsers.length !== validUserIds.length) {
        return res.status(responsesStatus.NotFound).json({
          error: "Some users not found"
        });
      }
    }

    const assignmentDate = assignedAt ? new Date(assignedAt) : new Date();
    const results = [];

    // Process each assignment
    for (const assignment of assignments) {
      const { department, userId } = assignment;

      // Find cases that match this department
      const departmentCases = validCaseIds;

      if (departmentCases.length === 0) {
        continue;
      }

      // Get current assignment state before making changes
      const currentCases = await Case.find({ _id: { $in: departmentCases } });
      const currentUsers = await User.find({ 'assignedCases.caseId': { $in: departmentCases } });

      // Determine which department flag to set/unset
      let departmentFlag = {};
      switch (department.toLowerCase()) {
        case 'cadcam':
          departmentFlag = { isAssignedCadCam: action === 'unassign' ? false : true };
          break;
        case 'fitting':
          departmentFlag = { isAssignedFitting: action === 'unassign' ? false : true };
          break;
        case 'ceramic':
        case 'caramic': // Handle typo in your data
          departmentFlag = { isAssignedCeramic: action === 'unassign' ? false : true };
          break;
        default:
          console.warn(`Unknown department: ${department}`);
          continue;
      }

      // Create log entry for this action
      const logEntry = {
        action: action,
        department: department,
        timestamp: assignmentDate,
        performedBy: {
          id: assignedBy,
          name: assignedByName
        },
        previousState: {
          departmentFlags: {},
          assignedUsers: []
        },
        newState: {
          departmentFlags: departmentFlag,
          assignedUsers: []
        },
        caseIds: departmentCases
      };

      // Capture previous state for logging
      currentCases.forEach(caseItem => {
        logEntry.previousState.departmentFlags[caseItem._id.toString()] = {
          isAssignedCadCam: caseItem.isAssignedCadCam,
          isAssignedFitting: caseItem.isAssignedFitting,
          isAssignedCeramic: caseItem.isAssignedCeramic
        };
      });

      // Capture previous user assignments
      currentUsers.forEach(user => {
        const userAssignments = user.assignedCases.filter(assignment =>
          assignment.caseId && departmentCases.includes(assignment.caseId.toString()) &&
          assignment.department.toLowerCase() === department.toLowerCase()
        );
        if (userAssignments.length > 0) {
          logEntry.previousState.assignedUsers.push({
            userId: user._id.toString(),
            userName: `${user.firstName} ${user.lastName}`,
            assignments: userAssignments
          });
        }
      });

      // Handle reassignment: Remove previous assignments first
      if (action === 'reassign') {
        // Remove cases from all users' assignedCases arrays for this department
        await User.updateMany(
          { 'assignedCases.caseId': { $in: departmentCases } },
          {
            $pull: {
              assignedCases: {
                caseId: { $in: departmentCases },
                department: department
              }
            }
          }
        );
      }

      // Handle unassignment: Remove from users and set flags to false
      if (action === 'unassign') {
        // Remove cases from all users' assignedCases arrays for this department
        await User.updateMany(
          { 'assignedCases.caseId': { $in: departmentCases } },
          {
            $pull: {
              assignedCases: {
                caseId: { $in: departmentCases },
                department: department
              }
            }
          }
        );
      }

      // Create assignment history entry
      const assignmentHistoryEntry = {
        action: action,
        department: department,
        timestamp: assignmentDate,
        performedBy: {
          id: assignedBy,
          name: assignedByName
        },
        previousAssignment: logEntry.previousState.assignedUsers,
        newAssignment: action === 'unassign' ? [] : [{
          userId: userId,
          userName: action !== 'unassign' ? 'Loading...' : null,
          department: department,
          assignedAt: assignmentDate
        }],
        departmentFlagsChanged: departmentFlag
      };

      // Update cases with department-specific assignment flag, logs, and assignment history
      const caseUpdateResult = await Case.updateMany(
        { _id: { $in: departmentCases } },
        {
          $set: departmentFlag,
          $push: {
            logs: {
              $each: [logEntry]
            },
            assignmentHistory: {
              $each: [assignmentHistoryEntry]
            }
          }
        }
      );

      // For assign and reassign actions, add to new user
      if (action !== 'unassign' && userId) {
        // Get user details for logging
        const targetUser = await User.findById(userId);

        // Create assignment objects for user
        const userAssignments = departmentCases.map(caseId => ({
          caseId: caseId,
          department: department,
          assignedAt: assignmentDate,
          assignedBy: assignedBy,
          assignedByName: assignedByName
        }));

        // Update user with assigned cases
        const userUpdateResult = await User.findByIdAndUpdate(
          userId,
          { $push: { assignedCases: { $each: userAssignments } } },
          { new: true }
        );

        // Update log entry with new state
        logEntry.newState.assignedUsers.push({
          userId: userId,
          userName: targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Unknown User',
          assignments: userAssignments
        });

        // Update the log entry and assignment history in cases with complete information
        await Case.updateMany(
          { _id: { $in: departmentCases } },
          {
            $set: {
              "logs.$[elem].newState.assignedUsers": logEntry.newState.assignedUsers,
              "assignmentHistory.$[hist].newAssignment": [{
                userId: userId,
                userName: targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Unknown User',
                department: department,
                assignedAt: assignmentDate
              }]
            }
          },
          {
            arrayFilters: [
              { "elem.timestamp": assignmentDate },
              { "hist.timestamp": assignmentDate }
            ]
          }
        );

        results.push({
          department,
          userId,
          action,
          casesAssigned: departmentCases.length,
          caseUpdateResult: caseUpdateResult.modifiedCount,
          userUpdated: !!userUpdateResult,
          logEntry: logEntry
        });
      } else {
        // For unassign action - update log entry
        await Case.updateMany(
          { _id: { $in: departmentCases } },
          {
            $set: {
              "logs.$[elem].newState.assignedUsers": []
            }
          },
          {
            arrayFilters: [{ "elem.timestamp": assignmentDate }]
          }
        );

        results.push({
          department,
          userId: null,
          action,
          casesUnassigned: departmentCases.length,
          caseUpdateResult: caseUpdateResult.modifiedCount,
          userUpdated: true,
          logEntry: logEntry
        });
      }
    }

    const message = action === 'unassign'
      ? "Cases unassigned successfully"
      : action === 'reassign'
        ? "Cases reassigned successfully"
        : "Cases assigned successfully";

    res.status(responsesStatus.OK).json({
      success: true,
      message: message,
      results: results,
      totalCasesProcessed: caseIds.length,
      totalAssignments: assignments.length,
      action: action
    });

  } catch (error) {
    console.error("Error processing case assignments:", error);
    res.status(responsesStatus.BadRequest).json({
      error: "Failed to process case assignments",
      details: error.message
    });
  }
};

// Get assigned cases by user ID
const getAssignedCasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(responsesStatus.BadRequest).json({
        error: "Invalid user ID"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(responsesStatus.NotFound).json({
        error: "User not found"
      });
    }

    // Get case IDs from assignedCases
    const caseIds = user.assignedCases.map(assignment => assignment.caseId);

    // Get the actual case documents
    const cases = await Case.find({ _id: { $in: caseIds } });

    res.status(responsesStatus.OK).json({
      success: true,
      message: `Assigned cases for user ${user.firstName} ${user.lastName}`,
      data: {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        cases: cases,
        count: cases.length
      }
    });

  } catch (error) {
    console.error("Error fetching assigned cases:", error);
    res.status(responsesStatus.BadRequest).json({
      error: "Failed to fetch assigned cases",
      details: error.message
    });
  }
};

// Get all assigned cases for a specific department across all users
// const getAllAssignedCasesByDepartment = async (req, res) => {
//   try {
//     const { department } = req.params;

//     if (!department) {
//       return res.status(responsesStatus.BadRequest).json({
//         error: "Department is required"
//       });
//     }

//     // Find users who have assignments for this department
//     // We use $elemMatch to check the assignedCases array
//     const usersWithAssignments = await User.find({
//       assignedCases: {
//         $elemMatch: {
//           department: { $regex: new RegExp(`^${department}$`, 'i') }
//         }
//       }
//     });

//     const results = [];

//     // Process each user found
//     for (const user of usersWithAssignments) {
//       // Filter assignments for this specific department
//       const relevantAssignments = user.assignedCases.filter(assignment =>
//         assignment.department.toLowerCase() === department.toLowerCase()
//       );

//       if (relevantAssignments.length === 0) continue;

//       const caseIds = relevantAssignments.map(a => a.caseId);

//       // Fetch the actual case documents
//       const cases = await Case.find({ _id: { $in: caseIds } });

//       // Create a map of cases for easy lookup by ID to preserve assignment details if needed
//       // or just return the cases list.
//       // The user requested: "get all assigned cases for all users tp specific department"
//       // Structuring by user seems most logical.

//       results.push({
//         userId: user._id,
//         userName: `${user.firstName} ${user.lastName}`,
//         count: cases.length,
//         cases: cases
//       });
//     }

//     res.status(responsesStatus.OK).json({
//       success: true,
//       department: department,
//       data: results
//     });

//   } catch (error) {
//     console.error("Error fetching assigned cases by department:", error);
//     res.status(responsesStatus.BadRequest).json({
//       error: "Failed to fetch assigned cases by department",
//       details: error.message
//     });
//   }
// };

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
  getCasesByMonthForShipment,
  assignCasesToUsers,
  getAssignedCasesByUserId,
  // getAllAssignedCasesByDepartment
};
