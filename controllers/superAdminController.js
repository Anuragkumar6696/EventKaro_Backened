const College = require("../models/College");

exports.getPendingColleges = async (req,res)=>{
   const colleges = await College.find({status:"pending"});
   res.json(colleges);
};

exports.approveCollege = async (req,res)=>{
   const {id} = req.params;

   const college = await College.findById(id);

   if(!college){
      return res.status(404).json({message:"College not found"});
   }

   college.status = "approved";
   await college.save();

   res.json({message:"College Approved"});
};

exports.rejectCollege = async (req,res)=>{
   const {id} = req.params;

   const college = await College.findById(id);

   if(!college){
      return res.status(404).json({message:"College not found"});
   }

   college.status = "rejected";
   await college.save();

   res.json({message:"College Rejected"});
};