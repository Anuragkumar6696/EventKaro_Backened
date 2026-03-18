const User = require("../models/User");
const College = require("../models/College");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // 🔥 CHECK APPROVAL FOR COLLEGE ADMIN
        if (user.role === "collegeadmin") {
            const college = await College.findById(user.college);

            if (college.status !== "approved") {
                return res.status(403).json({
                    message: "College not approved yet"
                });
            }
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                college: user.college
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login success",
            token,
            role: user.role   // ⭐ ADD THIS
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};