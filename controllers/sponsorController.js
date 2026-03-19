const Sponsor = require("../models/Sponsor");
const Event = require("../models/Event");


// ⭐ Create Sponsor (SuperAdmin)
exports.createSponsor = async (req, res) => {
  try {

    const sponsor = await Sponsor.create({
      name: req.body.name,
      logo: req.body.logo,
      website: req.body.website,
      tier: req.body.tier
    });

    res.status(201).json(sponsor);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ⭐ Assign Sponsor To Event
exports.assignSponsorToEvent = async (req, res) => {
  try {

    const { sponsorId, eventId } = req.body;

    const sponsor = await Sponsor.findById(sponsorId);
    const event = await Event.findById(eventId);

    if (!sponsor || !event) {
      return res.status(404).json({
        message: "Sponsor or Event not found"
      });
    }

    // add sponsor to event
    event.sponsors.push(sponsor._id);
    await event.save();

    // add event to sponsor
    sponsor.events.push(event._id);
    await sponsor.save();

    res.json({
      message: "Sponsor assigned successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ⭐ Get All Sponsors
exports.getSponsors = async (req, res) => {
  try {

    const sponsors = await Sponsor.find();

    res.json(sponsors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ⭐ Get Event Sponsors
exports.getEventSponsors = async (req, res) => {
  try {

    const event = await Event.findById(req.params.eventId)
      .populate("sponsors");

    res.json(event.sponsors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};