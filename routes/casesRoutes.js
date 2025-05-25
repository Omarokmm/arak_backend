const express = require("express");
const router = express.Router();
const { registerValidator } = require("../helper/validator");
const {
  getAllCases,
  createCase,
  getCaseById,
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
} = require("../controllers/CaseController");

// Get All Cases
router.get("/", getAllCases);
router.get("/counter", getCounter);
router.get("/cases-by-month", getCasesByMonth);
router.get("/cases-by-month-for-shipment", getCasesByMonthForShipment);
router.get("/search", getCaseSearch);
// Get Single Case
router.get("/:id", getCaseById);

// Create a new Case
router.post("/", createCase);
// Delete Case
router.delete("/:id", deleteCase);
router.patch("/:id", updateCase);
router.put("/:id/:section", updateProcessCase);
router.put("/:id/hold/:isHold", updateIsHoldCase);
router.put("/:id/approve/:isApprove", updateIsAprroveCase);
router.put("/:id/urgent/:isUrgent", updateIsUrgentCase);
module.exports = router;
