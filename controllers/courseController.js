const Course=require("../models/courseModel")
const CourseAssignment=require("../models/courseAssignment")
const { find } = require('../models/courseModel')
const addCourse=async (req,res)=>{
    try{ 
     const oldCourse=Course.find(
         {
         name:req.body.name,
         slotsPerWeek:req.body.slotsPerWeek,
        }
     );
     if(!oldCourse){
    const course=new Course({
      name:req.body.name ,
      slotsPerWeek:req.body.slotsPerWeek,
      department:[
          req.body.departmentId],
    })
    await course.save();
    }   
    else{
        const newCourse={};
        const array=oldCourse.department;
        array.add(req.body.departmentId)
        newCourse.department=array
        const room=await Room.findOneAndUpdate({_id:oldCourse._id},newCourse)
    }
  
   return res.json({message:"Course added"})

}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }

}
module.exports={addCourse}
