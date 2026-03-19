const express = require("express");
const router = express.Router();

const {
   getPendingColleges,
   approveCollege,
   rejectCollege,
   getApprovedColleges // ✅ imported
} = require("../controllers/superAdminController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get(
  "/pending",
  protect,
  allowRoles("superadmin"),
  getPendingColleges
);

router.patch(
  "/approve/:id",
  protect,
  allowRoles("superadmin"),
  approveCollege
);

router.patch(
  "/reject/:id",
  protect,
  allowRoles("superadmin"),
  rejectCollege
);

// ✅ NEW: Route to get all approved colleges
router.get(
  "/approved",
  protect,
  allowRoles("superadmin"), // or you can make this public if frontend can see approved colleges
  getApprovedColleges
);

module.exports = router;