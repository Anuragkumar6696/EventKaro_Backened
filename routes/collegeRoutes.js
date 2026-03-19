const express = require("express");
const router = express.Router();

const {
  registerCollege,
  updateCollegeProfile,
  getApprovedCollegesPublic,
  getCollegeWithEvents
} = require("../controllers/collegeController");

const { protect, allowRoles } =
require("../middleware/authMiddleware");

const upload = require("../middleware/upload");


// ⭐ REGISTER
router.post("/register", registerCollege);


// ⭐ UPDATE PROFILE
router.patch(
 "/profile",
 protect,
 allowRoles("collegeadmin"),
 upload.single("logo"),
 updateCollegeProfile
);


// ⭐ PUBLIC COLLEGES
router.get("/public", getApprovedCollegesPublic);

// ⭐ SINGLE COLLEGE PAGE
router.get("/public/:id", getCollegeWithEvents);

module.exports = router;