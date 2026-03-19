const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {

    console.log("BODY →", req.body);
    console.log("FILES →", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one poster"
      });
    }

    const images = req.files.map(file => file.path);

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      venue: req.body.venue,
      city: req.body.city,
      eventDate: req.body.eventDate,
      posters: images,
      college: req.user.college
    });

    res.status(201).json({
      message: "Event Created",
      event
    });

  } catch (err) {

    console.log("EVENT ERROR 🔥", err);

    res.status(500).json({
      message: "Server Error",
      error: err.message
    });

  }
};


exports.getMyEvents = async (req, res) => {
    try {

        const events = await Event.find({
            college: req.user.college
        });

        res.json(events);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.updateEvent = async (req, res) => {
  try {

    let data = { ...req.body };

    if (req.files && req.files.length > 0) {
      data.posters = req.files.map(file => file.path);
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        college: req.user.college
      },
      data,
      { returnDocument: "after" }
    );

    res.json({
      message: "Event Updated",
      event
    });

  } catch (err) {

    console.log("UPDATE ERROR 🔥", err);

    res.status(500).json({
      message: "Server Error",
      error: err.message
    });

  }
};


exports.deleteEvent = async (req, res) => {
    try {

        await Event.findOneAndDelete({
            _id: req.params.id,
            college: req.user.college
        });

        res.json({ message: "Event Deleted" });

    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
};

exports.getAllEventsForSuperAdmin = async (req, res) => {
  try {

    const events = await Event.find()
      .populate("college", "name city");

    res.json(events);

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

exports.getAllPublicEvents = async (req,res)=>{
  try{

    const events = await Event.find({ status:"upcoming" })
      .populate("college","name city logo");

    res.json(events);

  }catch(err){
    res.status(500).json({ message:"Server Error" });
  }
};