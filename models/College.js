const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true
 },

 city:String,
 description:String,

 website:String,
 address:String,
 phone:String,
 logo:String,
 about:String,

 status:{
  type:String,
  enum:["pending","approved","rejected"],
  default:"pending"
 }

},{timestamps:true});

module.exports = mongoose.model("College",collegeSchema);