const express = require("express");
const router = express.Router();
const { submitEnquiry, getEventEnquiries, sendNewsletter } = require("../controllers/eventEnquiryController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Student submits an enquiry
router.post("/submit", submitEnquiry);

// College admin fetches all enquiries for a specific event
router.get("/event/:eventId/enquiries", protect, allowRoles("collegeadmin"), getEventEnquiries);

// College admin sends newsletter to all users who submitted enquiry
// router.post("/newsletter", protect, allowRoles("collegeadmin"), sendNewsletter);

module.exports = router;