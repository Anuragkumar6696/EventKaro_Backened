const EventEnquiry = require("../models/EventEnquiry");
const Event = require("../models/Event");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * POST /api/event-registration/submit
 * Student submits an enquiry
 */
exports.submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, eventId } = req.body;

    // 1️⃣ Validate event
    const event = await Event.findById(eventId).populate("college");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const college = event.college;

    // 2️⃣ Find college admins
    const admins = await User.find({ college: college._id, role: "collegeadmin" });
    if (!admins || admins.length === 0)
      return res.status(404).json({ message: "College admin not found" });

    // 3️⃣ Save enquiry
    const enquiry = await EventEnquiry.create({
      name,
      email,
      phone,
      message,
      event: event._id,
      college: college._id,
    });

    // 4️⃣ Send email to college admins
    const adminEmails = admins.map((a) => a.email);
    await sendEmail({
      to: adminEmails,
      subject: `New Enquiry for ${event.title}`,
      html: `
        <h3>New Enquiry Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
        <p><strong>Event:</strong> ${event.title}</p>
        <p><strong>College:</strong> ${college.name}</p>
      `,
    });

    // 5️⃣ Send confirmation email to student
    await sendEmail({
      to: email,
      subject: `Your Enquiry for ${event.title} Received`,
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for your interest in <strong>${event.title}</strong> hosted by <strong>${college.name}</strong>.</p>
        <p>Our college admin will contact you shortly.</p>
        <p>Regards,<br/>EventKaro Team</p>
      `,
    });

    res.status(201).json({
      message: "Enquiry submitted. Emails sent to college admin and student.",
      enquiry,
    });
  } catch (err) {
    console.error("❌ submitEnquiry error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * GET /api/event-registration/event/:eventId/enquiries
 * College admin fetches all enquiries for an event
 */
exports.getEventEnquiries = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate("college");
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check college admin access
    if (req.user.role !== "collegeadmin" || req.user.college.toString() !== event.college._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const enquiries = await EventEnquiry.find({ event: eventId }).sort({ createdAt: -1 });
    res.json({ event: event.title, college: event.college.name, enquiries });
  } catch (err) {
    console.error("❌ getEventEnquiries error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};