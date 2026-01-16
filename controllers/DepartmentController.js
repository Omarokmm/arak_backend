const Department = require("../models/DepartmentModel");
const User = require("../models/UserModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const CaseModel = require("../models/CaseModel");
// Get All departments

const getDepartments = async (req, res) => {
  const departments = await Department.find({});
  try {
    res.status(responsesStatus.OK).json(departments);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};

// Get Department By Id
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const department = await Department.findById(id);
    if (!department) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Department!" });
    }
    res.status(responsesStatus.OK).json(department);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// get users in  Department
const getAllUsersInDepartment = async (req, res) => {
   const { id } = req.params;
  try {
    // Fetch all departments
    // Array to store users in departments
    const usersInDepartments = [];

    // Loop through each department
    // for (const department of departments) {
    //   // Fetch users in the current department


    //   // Push users to the array
    //   usersInDepartments.push({ department: department.name, users });
    // }
       const users = await User.find({ departments: id });
      
    res.json(users);
  } catch (error) {
    console.error("Error fetching users in departments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get Cases by Department 
const getCasesByDepartment = async (req, res) => {
  const currentDate = new Date();
  const departmentName = req.params.departmentName; // Get department name from URL parameters
  const caseIdsEnd = new Set(); // Set to track unique case IDs
  const caseIdsProcessed = new Set(); // Set to track unique case IDs
  const caseIdsProcessedPause = new Set(); // Set to track unique case IDs
  const resultsEnd = [];
  const resultsStart = [];
  const resultsPause = [];
  const resultsHolding = [];
  year =  currentDate.getFullYear();
  month =  currentDate.getMonth() + 1; 
  try {
       // Create start date for the 1st day of the month at 00:00:00
        const startOfMonth = new Date(year, month - 4, 1); // month is 0-indexed, so subtract 1
        startOfMonth.setHours(0, 0, 0, 0); // Start of the day
    
        // Create end date for the last day of the month at 23:59:59.999
        const endOfMonth = new Date(year, month + 4, 0); // Get last day of the month
        endOfMonth.setHours(23, 59, 59, 999); // End of the day
    
        // Retrieve cases created within the specified month range
        const cases = await CaseModel.find({
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        }).sort({ createdAt: -1 });
    // const cases = await CaseModel.find();

    // Check if departmentName is valid
    if (!['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking','delivering'].includes(departmentName)) {
      return res.status(400).send('Invalid department name');
    }
    cases.forEach(caseItem => {
      const phase = departmentName;
      const lastAction = caseItem[phase].actions[caseItem[phase].actions.length - 1];
      if (lastAction?.prfeix === 'end' && caseItem[phase].status.isEnd && !caseItem.isHold) {
        if (!caseIdsEnd.has(caseItem._id.toString())) {
          caseIdsEnd.add(caseItem._id.toString());
          resultsEnd.push(caseItem);
        }
      }
    });

    // Cases are Starting
    // 
    cases.forEach(caseItem => {
      const phase = departmentName;
      const lastAction = caseItem[phase].actions[caseItem[phase].actions.length - 1];
      if (lastAction?.prfeix === 'start' && !caseItem.isHold && !caseItem[phase].status.isStart)
      {
        if (!caseIdsProcessed.has(caseItem._id.toString())) {
          caseIdsProcessed.add(caseItem._id.toString());
          resultsStart.push(caseItem);
        }
      }
    });

    // Cases are Pausing
    cases.forEach(caseItem => {
      const phase = departmentName;
      const lastActionPause = caseItem[phase].actions[caseItem[phase].actions.length - 1];
      if (lastActionPause?.prfeix === 'pause' && !caseItem.isHold) {
        caseItem[phase].actions.forEach(action => {
            // Check if this case ID has already been processed
            if (!caseIdsProcessedPause.has(caseItem._id.toString())) {
              caseIdsProcessedPause.add(caseItem._id.toString());
              resultsPause.push(caseItem);
            }
        });
      }
    });

    // Holding
    cases.forEach(caseItem => {
      if (caseItem.isHold && caseItem?.historyHolding[caseItem.historyHolding.length - 1]?.isHold) {
        resultsHolding.push(caseItem);
      }
    });

    res.json({
      casesEnd: resultsEnd,
      casesStart: resultsStart,
      casesPause: resultsPause,
      casesHolding: resultsHolding
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create new Department
const createDepartment = async (req, res) => {
  const {
    name,
    description,
    photo,
    head,
    active,
    sections
  } = req.body;
  const emptyFields = [];
  if (!name) {
    emptyFields.push("name");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!head) {
    emptyFields.push("head");
  }
  if (!active) {
    emptyFields.push("active");
  }
  if (emptyFields.length > 0) {
    return res.status(responsesStatus.BadRequest).json({
      error: `Please fill in the following fields: ${emptyFields.join(", ")}`,
      emptyFields,
    });
  }
  // add department to db
  try {
    const department = await Department.create({
      name,
      description,
      head,
      active,
      photo,
      sections,
    });
    res.status(responsesStatus.OK).json(department);
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    // const department = await Department.findByIdAndDelete({ _id: id });
    // Step 1: Fetch users associated with the department
    const users = await User.find({ departments: id });
    


    // Step 2: Update users to remove association with the department
    await Promise.all(
      users.map(async (user) => {
        // Option 1: Set department field to null
        // user.department = null;

        // Option 2: Remove department ID from the departments array
        const filteredDepartments = user.departments.filter(
          (depId) => depId.toString() !== id.toString()
        );
        user.departments = filteredDepartments;
        console.log(user.departments,id);
        await user.save();
      })
    );

    // Step 3: Delete the department
    // Replace Department with your actual model name
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Department!" });
    }
    res.status(responsesStatus.OK).json(department);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const department = await Department.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!department) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(department);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getAllUsersInDepartment,
  deleteDepartment,
  updateDepartment,
  getCasesByDepartment
};
