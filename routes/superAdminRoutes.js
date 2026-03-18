const express = require("express");
const router = express.Router();

const {
   getPendingColleges,
   approveCollege,
   rejectCollege
} = require("../controllers/superAdminController");

const {protect} = require("../middleware/authMiddleware");
const {allowRoles} = require("../middleware/roleMiddleware");

router.get("/pending",
protect,
allowRoles("superadmin"),
getPendingColleges);

router.patch("/approve/:id",
protect,
allowRoles("superadmin"),
approveCollege);

router.patch("/reject/:id",
protect,
allowRoles("superadmin"),
rejectCollege);

module.exports = router;