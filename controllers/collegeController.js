const College = require("../models/College");
const User = require("../models/User");
const Event = require("../models/Event");

exports.getCollegeWithEvents = async (req, res) => {
  try {

    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        message: "College not found"
      });
    }

    const events = await Event.find({
      college: college._id,
      status: "upcoming"
    });

    res.json({
      college,
      events
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

exports.registerCollege = async (req, res) => {
    try {

        const { name, email, password, city, description } = req.body;

        // check college already exists
        const existingCollege = await College.findOne({ email });

        if (existingCollege) {
            return res.status(400).json({
                message: "College already registered"
            });
        }

        // create college
        const college = await College.create({
            name,
            email,
            city,
            description,
            status: "pending"
        });

        // create admin user
        const admin = await User.create({
            name: name + " Admin",
            email,
            password,
            role: "collegeadmin",
            college: college._id
        });

        res.status(201).json({
            message: "College Registered. Waiting for approval",
            college
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.updateCollegeProfile = async (req, res) => {
    try {

        const collegeId = req.user.college;

        const updateData = {
            ...req.body
        };

        // ⭐ if logo uploaded
        if (req.file) {
            updateData.logo = req.file.path;
        }

        const updatedCollege = await College.findByIdAndUpdate(
            collegeId,
            updateData,
            { new: true }
        );

        res.json({
            message: "College profile updated",
            updatedCollege
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};
exports.getApprovedCollegesPublic = async (req, res) => {
  try {

    const colleges = await College.find({ status: "approved" });

    res.json(colleges);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};