const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

   title:{
      type:String,
      required:true
   },

   description:String,

   venue:{
      type:String,
      required:true
   },

   city:String,

   eventDate:{
      type:Date,
      required:true
   },

   lastDate:Date,

   seats:{
      type:Number,
      default:100
   },

   posters:[   // ⭐ MULTIPLE IMAGES
      {
         type:String
      }
   ],

   price:{
      type:Number,
      default:0
   },

   category:String,

   college:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"College"
   },

   status:{
      type:String,
      enum:["upcoming","completed","cancelled"],
      default:"upcoming"
   },

   sponsors: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sponsor"
  }
],

},{timestamps:true});

module.exports = mongoose.model("Event",eventSchema);