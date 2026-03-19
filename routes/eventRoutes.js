const router = require("express").Router();

const upload = require("../middleware/upload");
const { protect, allowRoles } =
require("../middleware/authMiddleware");

const {
 createEvent,
 getMyEvents,
 updateEvent,
 deleteEvent,
 getAllEventsForSuperAdmin   // ⭐ ADD THIS
} = require("../controllers/eventController");


// ⭐ PUBLIC / SUPERADMIN → GET ALL EVENTS
router.get(
 "/admin/all",
 protect,
 allowRoles("superadmin"),
 getAllEventsForSuperAdmin
);


// ⭐ COLLEGE ADMIN CREATE EVENT
router.post(
 "/create",
 protect,
 allowRoles("collegeadmin"),
 upload.array("posters",10),
 createEvent
);


// ⭐ COLLEGE ADMIN MY EVENTS
router.get(
 "/my",
 protect,
 allowRoles("collegeadmin"),
 getMyEvents
);


// ⭐ UPDATE EVENT
router.patch(
 "/:id",
 protect,
 allowRoles("collegeadmin"),
 upload.array("posters",10),
 updateEvent
);


// ⭐ DELETE EVENT
router.delete(
 "/:id",
 protect,
 allowRoles("collegeadmin"),
 deleteEvent
);

module.exports = router;