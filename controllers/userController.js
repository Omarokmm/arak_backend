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
const getCasesByUser = async (req, res) => {
  const technicianId = req.params.id;
  const caseIdsProcessed = new Set(); // Set to track unique case IDs
  const caseIdsProcessedPause = new Set(); // Set to track unique case IDs
  const resultsEnd = [];
  const resultsStart = [];
  const resultsPause = [];
  const resultsHolding = [];
  let count = 0;
  let count1 = 0;
  try {
    const cases = await Case.find();
    // Cases Ended
    cases.forEach(caseItem => {
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking'].forEach(phase => {
        if (caseItem[phase] && caseItem[phase].status.isEnd ) {
          caseItem[phase].actions.forEach(action => {
            if (action.technicianId === technicianId && action.dateEnd) {
              count++
              resultsEnd.push(caseItem);
            }
          });
        }
      });
    });
    // Cases are Starting
    cases.forEach(caseItem => {
      // Check all the relevant phases
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking'].forEach(phase => {
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
      ['cadCam', 'fitting', 'plaster', 'ceramic', 'designing', 'qualityControl', 'receptionPacking'].forEach(phase => {
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
  getCasesByUser
};
