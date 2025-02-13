const User = require("../models/UserModel");
const Case = require("../models/CaseModel");
const Department = require("../models/DepartmentModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const {validationResult} = require("express-validator");

// Get All User
const getUsers = async (req, res) => {
  const users = await  User.find().populate('departments', '_id name');
  try {
    res.status(responsesStatus.OK).json(users);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};


// Get Cases by Users 
// Get Cases by Users 
const getCasesByUser = async (req, res) => {
  const technicianId = req.params.id;
  const caseIdsEnd = new Set(); // Set to track unique case IDs
  const caseIdsProcessed = new Set(); // Set to track unique case IDs
  const caseIdsProcessedPause = new Set(); // Set to track unique case IDs
  const resultsEnd = [];
  const resultsStart = [];
  const resultsPause = [];
  const resultsHolding = [];
  let count = 0;
  let count1 = 0;
  try {
    // Get the current date and subtract 3 months
const threeMonthsAgo = moment().subtract(3, 'months').toDate();

// Query to get cases from the last 3 months
const cases = await Case.find({
  createdAt: { $gte: threeMonthsAgo }
});

    // const cases = await Case.find();
    // Cases Ended
    cases.forEach(caseItem => {
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking','delivering'].forEach(phase => {
        const lastActionEnd = caseItem[phase].actions[caseItem[phase].actions.length - 1];
        if (caseItem[phase] && caseItem[phase].status.isEnd ) {
          caseItem[phase].actions.forEach(action => {
            if (lastActionEnd.technicianId === technicianId && action.dateEnd) {
                // Check if this case ID has already been processed
                if (!caseIdsEnd.has(caseItem._id.toString())) {
                  caseIdsEnd.add(caseItem._id.toString());
                  resultsEnd.push(caseItem);
                }
              count++
              
            }
          });
        }
      });
    });
    // Cases are Starting
    cases.forEach(caseItem => {
      // Check all the relevant phases
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking','delivering'].forEach(phase => {
        const lastAction = caseItem[phase].actions[caseItem[phase].actions.length - 1];
        if (lastAction?.prfeix === 'start') {
          caseItem[phase].actions.forEach(action => {
            if (lastAction.technicianId === technicianId) {
              // Check if this case ID has already been processed
              if (!caseIdsProcessed.has(caseItem._id.toString())) {
                caseIdsProcessed.add(caseItem._id.toString());
                resultsStart.push(caseItem);
              }
              count1++;
            }
          });
        }
      });
    });
    // Cases are Pausing
    cases.forEach(caseItem => {
      // Check all the relevant phases
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking','delivering'].forEach(phase => {
        const lastActionPause = caseItem[phase].actions[caseItem[phase].actions.length - 1];
        if (lastActionPause?.prfeix === 'pause') {
          caseItem[phase].actions.forEach(action => {
            if (lastActionPause.technicianId === technicianId) {
              // Check if this case ID has already been processed
              if (!caseIdsProcessedPause.has(caseItem._id.toString())) {
                caseIdsProcessedPause.add(caseItem._id.toString());
                resultsPause.push(caseItem);
              }
              count1++;
            }
          });
        }
      });
    });
    // Holding cad Cam
    cases.forEach(caseItem => {
      // Check all the relevant phases
      if(caseItem.isHold && caseItem?.historyHolding[caseItem.historyHolding.length - 1]?.id === technicianId){
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
}

// Get Cases In Dates

const getCasesByUser1 = async (req, res) => {
  const technicianId = req.params.id;
  let { year, month } = req.query;

  // Default to current year and month if not provided
  const currentDate = new Date();
  year = parseInt(year, 10) || currentDate.getFullYear();
  month = parseInt(month, 10) || (currentDate.getMonth() + 1); // MongoDB months are 0-indexed

  // Calculate the start and end date of the month
  const startDate = new Date(year, month - 1, 1); // First day of the month
  const endDate = new Date(year, month, 0); // Last day of the month
  endDate.setHours(23, 59, 59, 999); // Ensure the last millisecond of the month is included

  const caseIdsEnd = new Set();
  const caseIdsProcessed = new Set();
  const caseIdsProcessedPause = new Set();
  const resultsEnd = [];
  const resultsStart = [];
  const resultsPause = [];
  const resultsHolding = [];

  let count = 0;
  let count1 = 0;

  try {
    // MongoDB query to fetch cases that have actions within the specified date range
    const cases = await Case.find({
      $or: [
        {
          "cadCam.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate } // Filter by technician and dateStart for "started" actions
            }
          }
        },
        {
          "fitting.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "plaster.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "ceramic.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "designing.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "qualityControl.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "receptionPacking.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        },
        {
          "delivering.actions": {
            $elemMatch: {
              technicianId: technicianId,
              dateStart: { $gte: startDate, $lte: endDate }
            }
          }
        }
      ]
    });

    console.log("Fetched Cases:", cases); // Debug: Check the fetched cases

    cases.forEach((caseItem) => {
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking', 'delivering'].forEach((phase) => {
        // Check if the actions array exists for each phase
        if (caseItem[phase]?.actions) {
          caseItem[phase].actions.forEach((action) => {
            // Log the action to debug the fields
            console.log(`Processing action: ${JSON.stringify(action)}`);

            // For Ended cases (dateEnd)
            if (action.dateEnd && action.technicianId === technicianId) {
              const actionDateEnd = new Date(action.dateEnd);
              if (actionDateEnd >= startDate && actionDateEnd <= endDate) {
                if (!caseIdsEnd.has(caseItem._id.toString())) {
                  caseIdsEnd.add(caseItem._id.toString());
                  resultsEnd.push(caseItem);
                }
                count++; // For counting ended cases
              }
            }

            // For Started cases (dateStart) - Handling both cases with dateStart only and with dateEnd
            if (action.dateStart && action.technicianId === technicianId) {
              const actionDateStart = new Date(action.dateStart);
              if (actionDateStart >= startDate && actionDateStart <= endDate) {
                if (!caseIdsProcessed.has(caseItem._id.toString())) {
                  caseIdsProcessed.add(caseItem._id.toString());
                  resultsStart.push(caseItem);
                }
                count1++; // For counting started cases
              }
            }

            // For Paused cases (prfeix: 'pause')
            if (action.prfeix === 'pause' && action.technicianId === technicianId) {
              const actionDatePause = new Date(action.dateEnd);
              if (actionDatePause >= startDate && actionDatePause <= endDate) {
                if (!caseIdsProcessedPause.has(caseItem._id.toString())) {
                  caseIdsProcessedPause.add(caseItem._id.toString());
                  resultsPause.push(caseItem);
                }
                count1++; // For counting paused cases
              }
            }
          });
        }
      });

      // Process Holding cases (check if isHold and technicianId in historyHolding)
      if (caseItem.isHold && caseItem.historyHolding?.length > 0) {
        const lastHolding = caseItem.historyHolding[caseItem.historyHolding.length - 1];
        if (lastHolding?.id === technicianId) {
          resultsHolding.push(caseItem);
        }
      }
    });

    console.log('Results End:', resultsEnd); // Debug: Output ended cases
    console.log('Results Start:', resultsStart); // Debug: Output started cases
    console.log('Results Pause:', resultsPause); // Debug: Output paused cases
    console.log('Results Holding:', resultsHolding); // Debug: Output holding cases

    res.json({
      casesEnd: resultsEnd,
      casesStart: resultsStart,
      casesPause: resultsPause,
      casesHolding: resultsHolding
    });
  } catch (error) {
    console.error('Error fetching cases:', error); // Log error
    res.status(500).send(error.message);
  }
};







// Get User By Id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(responsesStatus.NotFound).json({ error: "No Such User!" });
    }
    res.status(responsesStatus.OK).json(user);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Login User 
const generateAccessToken =async (user)=>{
  const token = await jwt.sign(user, process.env.ACCESS_SECRET_TOKEN,{expiresIn:"2h"}); 
  return token
}
const loginUser = async (req, res) => {
  const {
    email,
    password,
   
  } = req.body;
  // add User to db
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: "Email & Password is incorrect",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
     if (!isPasswordMatch) {
       return res.status(responsesStatus.BadRequest).json({
         success: false,
         msg: "Email & Password is incorrect",
       });
     }
    const departmentIds = userData.departments;
    const departments = await Department.find({ _id: { $in: departmentIds } });
    //    const userWithDepartments = {
    //   ...userData,
    //   departments: departments.map(dept => dept.name),
    // };
    const accessToken = generateAccessToken({user:userData})
       return res.status(responsesStatus.OK).json({
         success: true,
         msg: "Login Successfully",
         accessToken: accessToken,
         tokenType: "Bearer",
         data:userData,
         departments :departments.map(dept => {
          return {
           name: dept.name,
           id: dept._id,
          }
         })
       });
  } catch (error) { 
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Create new User
const createUser = async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    phone,
    address: { street, city, state, zipCode, country },
    password,
    confirmPassword,
    joiningDate,
    licenseExpireDate,
    gender,
    dateOfBirth,
    photo,
    departments,
    active,
    roles,
  } = req.body;
  // add User to db
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(responsesStatus.BadRequest).json({
          success: false,
          msg: "Error",
          errors: errors.array(),
        });
      }
      const isExistUser = await User.findOne({email}) 
      if(isExistUser){
         return res.status(responsesStatus.BadRequest).json({
           success: false,
           msg: "Email is Exist",
         });
      }
      const hashedPAssword = await bcrypt.hash(password,10);
      const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
      const workout = await User.create({
      firstName,
      lastName,
      email,
      phone,
      address: {
        street,
        city : city ? city : "city",
        state,
        zipCode,
        country,
      },
      password: hashedPAssword,
      confirmPassword: hashedConfirmPassword,
      gender,
      dateOfBirth,
      joiningDate,
      licenseExpireDate,
      photo,
      roles,
      departments,
      active,
    });
    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Registered Successfully",
      data: workout,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const user = await User.findByIdAndDelete({ _id: id });
    if (!user) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such User!" });
    }
    res.status(responsesStatus.OK).json(user);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Update User

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!user) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(user);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// change password
// POST /api/users/change-password
const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: 'Error',
        errors: errors.array(),
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: 'User not found',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;
    await user.save();

    res.status(responsesStatus.OK).json({
      success: true,
      msg: 'Password updated successfully',
    });
  } catch (error) {
    return res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
module.exports = {
  createUser,
  getUsers,
  loginUser,
  getUserById,
  deleteUser,
  updateUser,
  changePassword,
  getCasesByUser,
};
