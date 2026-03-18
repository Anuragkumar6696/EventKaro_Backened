const express = require("express");
const router = express.Router();

const { registerCollege, updateCollegeProfile } =
require("../controllers/collegeController");

const { protect, allowRoles } =
require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

router.post("/register", registerCollege);

router.patch(
 "/profile",
 protect,
 allowRoles("collegeadmin"),
 upload.single("logo"),
 updateCollegeProfile
);

module.exports = router;