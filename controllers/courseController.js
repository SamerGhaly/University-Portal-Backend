const Course=require("../models/courseModel")
const CourseAssignment=require("../models/courseAssignment")
const addCourse=async (req,res)=>{

    try{ 
        
    const course=new Course({
      name:req.body.name ,
      slotsPerWeek:req.body.slotsPerWeek,
      department:[
          req.body.departmentId],

    })
   await office.save();
   return res.json({message:"Room added"})

}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }

}
