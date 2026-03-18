const router = require("express").Router();

const upload = require("../middleware/upload");
const { protect, allowRoles } =
require("../middleware/authMiddleware");

const {
 createEvent,
 getMyEvents,
 updateEvent,
 deleteEvent
} = require("../controllers/eventController");

router.post(
 "/create",
 protect,
 allowRoles("collegeadmin"),
 upload.array("posters",10),   // ⭐ BULK UPLOAD
 createEvent
);

router.get(
 "/my",
 protect,
 allowRoles("collegeadmin"),
 getMyEvents
);

router.patch(
 "/:id",
 protect,
 allowRoles("collegeadmin"),
 upload.array("posters",10),
 updateEvent
);

router.delete(
 "/:id",
 protect,
 allowRoles("collegeadmin"),
 deleteEvent
);

module.exports = router;