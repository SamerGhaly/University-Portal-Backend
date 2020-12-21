const Course=require("../models/courseModel")
const CourseAssignment=require("../models/courseAssignment")
const Member=require('../models/memberModel')
const Department=require("../models/departmentModel")
const {courseNotFound,notInstructor,departmentDoesnotExist,entryAlreadyExist,catchError,entryNotExist}=require("../constants/errorCodes")
const {memberRoles}=require("../constants/constants")
const { find } = require('../models/courseModel')
const addCourse=async (req,res)=>{
    try{ 
        const isthereDepartment=await Department.findById(req.body.departmentId)
        if(!isthereDepartment)
        return res.status(400).json({
            message: 'department Does not Exist error',
            code: departmentDoesnotExist,
          }) 
        const oldCourse=await Course.findOne(
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
        if(array.includes(req.body.departmentId))
        return res.status(400).json({
            message: 'entry is Already Exist',
            code: entryAlreadyExist,
          }) 
        array.push(req.body.departmentId)
        newCourse.department=array
        await Course.findOneAndUpdate({_id:oldCourse._id},newCourse)
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



const updateCourse=async (req,res)=>{
    try{ 
        let course;
        const newCourse={};      
        if(req.body.name)
        newCourse.name=req.body.name
        if(req.body.slotsPerWeek)
        newCourse.slotsPerWeek=req.body.slotsPerWeek
        if((req.body.departmentIdRemoved!==undefined)&(req.body.departmentIdAdded!==undefined)) {
            console.log(55)
            newCourse.$pull={department:req.body.departmentIdRemoved}
             course=await Course.findOneAndUpdate({_id:req.body.courseId},newCourse)
             console.log(66)
             course=await Course.findOneAndUpdate({_id:req.body.courseId},{$push:{department:req.body.departmentIdAdded}})
        }
       else{
        if(req.body.departmentIdRemoved) 
         newCourse.$pull={department:req.body.departmentIdRemoved}
         if(req.body.departmentIdAdded) 
         newCourse.$push={department:req.body.departmentIdAdded}
         course=await Course.findOneAndUpdate({_id:req.body.courseId},newCourse,)
       }
        if(!course) return res.status(404).json({
          message: 'course does not exist',
          code: entryNotExist,
        })
        return res.json({message:"Course updated"})
      
}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }

}


const deleteCourse=async (req,res)=>{
    try{   
        const course=await Course.findOneAndRemove({_id:req.body.courseId})
        if(!course) return res.status(404).json({
          message: 'course does not exist',
          code: entryNotExist,
        })
        return res.json({message:"Course deleted"})
      
}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }

}
const assignCourseInstructor=async(req,res)=>{
  try{
   //   check member is instructor
      const member=await Member.findOne({_id:req.body.instructorId,type:memberRoles.INSTRUCTOR})
        if(!member)
        return res.status(404).json({
            message: ' not Instructor',
            code: notInstructor,
          })

          const course=await Course.findById(req.body.courseId)
          if(!course)
          return res.status(404).json({
              message: 'No A Course',
              code: courseNotFound,
            })

        // const x= await Department.find().populate('coursesPerDepartment')
        // res.send((x))
   //   department of hod is department  of course
          const isCourseInDepartment=
          await Member
          .findById(req.member.memberId)
          .populate({
              path:'department',
              populate:{
                  path:'coursesPerDepartment',
                  match:{_id:req.body.courseId}
              }
          })
      if(isCourseInDepartment.department.coursesPerDepartment.length==0) 
      return res.status(400).json({
        message: 'course id Not In Department',
        code: courseNotInDepartment,
      })
      console.log(isCourseInDepartment.department);
      courseAss=CourseAssignment({
          role:memberRoles.INSTRUCTOR,
          course:req.body.courseId,
          member:req.body.instructorId
      })
      const repeatedItem=await CourseAssignment.findOne({
        role:memberRoles.INSTRUCTOR,
        course:req.body.courseId,
        member:req.body.instructorId
      })
      console.log(repeatedItem)
      if(repeatedItem)
      return res.status(400).json({
        message: 'entry is Already Exist',
        code: entryAlreadyExist,
      })

     await courseAss.save();
    return res.json({
        message:'Instuctor Assigned To Course Successfully'
    })
}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports={addCourse,updateCourse,deleteCourse,assignCourseInstructor}
