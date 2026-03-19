const mongoose = require("mongoose");

const sponsorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  logo: {
    type: String
  },

  website: {
    type: String
  },

  tier: {
    type: String,
    enum: ["title", "gold", "silver", "bronze"],
    default: "silver"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Sponsor", sponsorSchema);