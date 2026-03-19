const College = require("../models/College");
const sendEmail = require("../utils/sendEmail"); // path to your Brevo email util

// Get pending colleges
exports.getPendingColleges = async (req, res) => {
  try {
    const colleges = await College.find({ status: "pending" });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Approve college and send email
exports.approveCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    college.status = "approved";
    await college.save();

    // Send approval email
    await sendEmail({
      to: college.email,
      subject: "Your College Has Been Approved",
      html: `<h2>Congratulations!</h2>
             <p>Your college <strong>${college.name}</strong> has been approved on EventKaro platform.</p>
             <p>You can now login and manage your college profile.</p>`
    });

    res.json({ message: "College Approved and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Reject college and send email
exports.rejectCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    college.status = "rejected";
    await college.save();

    // Send rejection email
    await sendEmail({
      to: college.email,
      subject: "Your College Registration Was Rejected",
      html: `<h2>Sorry!</h2>
             <p>We regret to inform you that your college <strong>${college.name}</strong> registration was rejected on EventKaro platform.</p>
             <p>If you think this is a mistake, please contact support.</p>`
    });

    res.json({ message: "College Rejected and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};