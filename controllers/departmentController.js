const { IdnotFound,noDepartment } = require('../constants/errorCodes')
const Department = require('../models/departmentModel')
const Faculty = require('../models/facultyModel')
const Member=require('../models/memberModel')
const addDepartment = (req, res) => {
  if (
    Faculty.findOne({ _id: req.body.faculty }, function (err, foundFaculty) {
      console.log(err)
      console.log(foundFaculty)
      if (!foundFaculty) {
        return res.json({
          code: IdnotFound,
          message: 'IdNotFound',
        })
      } else {
        Department.create(req.body)
        return res.json({
          message: 'Department added successfully',
        })
      }
    })
  );
}

const updateDepartment = (req, res) => {
  if (req.body.faculty) {
    if (
      Faculty.findOne({ _id: req.body.faculty }, function (err, foundFaculty) {
        console.log(err)
        console.log(foundFaculty)
        if (!foundFaculty) {
          return res.json({
            code: IdnotFound,
            message: 'facultyNotFound',
          })
        } else {
          Department.findByIdAndUpdate(
            req.body.id,
            { faculty: req.body.facuty },
            function (err) {
              if (err) {
                return res.json({
                  code: IdnotFound,
                  message: 'IdNotFound',
                })
              } else {
                return res.json({
                  message: 'Department updated successfully',
                })
              }
            }
          )
        }
      })
    );
  }
  if (req.body.name) {
    Department.findByIdAndUpdate(
      req.body.id,
      { name: req.body.name },
      function (err) {
        if (err) {
          return res.json({
            code: IdnotFound,
            message: 'IdNotFound',
          })
        } else {
          return res.json({
            message: 'Department updated successfully',
          })
        }
      }
    )
  }
}

const deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.body.id, function (err) {
    if (err) {
      return res.json({
        code: IdnotFound,
        message: 'IdNotFound',
      })
    } else {
      return res.json({
        message: 'Department deleted successfully',
      })
    }
  })
}
const viewMemberInDepartment=async (req, res) => {
  try{

const me=await Member.findById(req.member.memberId)
const out=await Department.findById(me.department).populate('membersPerDepartment')
if(!out)
 return res.json({
        code:   noDepartment,
        message: 'you have no Department ',
      })

  res.json(out)
  }catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'catch error',
          code: catchError,
        })
      }
    }
const viewAllMember_dayoff_InDepartment=async (req, res) => {
  try{
const me=await Member.findById(req.member.memberId)
const out=await Department.findById(me.department).select('membersPerDepartment')
.populate({
 path: 'membersPerDepartment',
 select:'dayoff'
 })
 let array=[]
 out.membersPerDepartment.forEach(element => {
   array.push({_id:element._id.toString(),
                'dayoff':element.dayoff  
                  })
 });
if(!out)
 return res.json({
        code:   noDepartment,
        message: 'you have no Department ',
      })
      
  res.json(array)
  }catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'catch error',
          code: catchError,
        })
      }
    }

    const viewMember_dayoff_InDepartment=async (req, res) => {
  try{
const me=await Member.findById(req.member.memberId)
const out=await Department.findById(me.department).select('membersPerDepartment')
.populate({
 path: 'membersPerDepartment',
 select:'dayoff',
 match:{_id:req.body.memberId}
 })
 console.log(out.membersPerDepartment);
 let element=out.membersPerDepartment
if(!element[0])
 return res.json({
        code:   noDepartment,
        message: 'you have no Department',
      })
      
  res.json(element[0].dayoff)
  }catch (err) {
        console.log(err)
        return res.status(500).json({
          message: 'catch error',
          code: catchError,
        })
      }
    }


module.exports = {viewAllMember_dayoff_InDepartment, viewMember_dayoff_InDepartment,addDepartment, updateDepartment, deleteDepartment,viewMemberInDepartment }
