const express = require("express");
const router = express.Router();

const { registerEvent, verifyOtp, sendBulkEmail, getRegisteredUsers } = require("../controllers/eventRegistrationController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// User registers for an event (requires login)
router.post("/register", protect, registerEvent);

// Verify OTP
router.post("/verify-otp", protect, verifyOtp);

// College admin sends bulk email to registered users
router.post("/bulk-email", protect, allowRoles("collegeadmin"), sendBulkEmail);

// College admin: get all registered users for a particular event
router.get("/event/:eventId/users", protect, allowRoles("collegeadmin"), getRegisteredUsers);

module.exports = router;