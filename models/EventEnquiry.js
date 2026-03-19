const mongoose = require("mongoose");

const eventEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventEnquiry", eventEnquirySchema);