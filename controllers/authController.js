const User = require("../models/User");
const College = require("../models/College");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("college");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 🔥 COLLEGE APPROVAL CHECK
    if (user.role === "collegeadmin") {
      const college = user.college;

      if (college.status !== "approved") {
        return res.status(403).json({ message: "College not approved yet" });
      }

      // ✅ Send email notification that college is approved (optional: only once)
      if (!college.notified) {
        await sendEmail({
          to: user.email,
          subject: `Your College "${college.name}" is login Successfully!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Congratulations!</h2>
              <p>Your college <strong>${college.name}</strong> has been approved on EventKaro.</p>
              <p>You can now log in and manage your events, students, and registrations.</p>
              <br/>
              <p>Regards,<br/><strong>EventKaro Team</strong></p>
            </div>
          `,
        });

        // Mark college as notified so we don't send duplicate emails
        college.notified = true;
        await college.save();
      }
    }

    // 🔑 Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        college: user.college?._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};