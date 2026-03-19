const express = require("express");
const router = express.Router();

const {
  createSponsor,
  assignSponsorToEvent,
  getSponsors,
  getEventSponsors
} = require("../controllers/sponsorController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

// superadmin create sponsor
router.post("/", protect, allowRoles("superadmin"), createSponsor);

// assign sponsor
router.post("/assign", protect, allowRoles("superadmin"), assignSponsorToEvent);

// all sponsors
router.get("/", getSponsors);

// event sponsors
router.get("/event/:eventId", getEventSponsors);

module.exports = router;