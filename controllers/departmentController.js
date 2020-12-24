const {
  IdnotFound,
  noDepartment,
  memberDoesnotExist,
} = require('../constants/errorCodes')
const Department = require('../models/departmentModel')
const Faculty = require('../models/facultyModel')
const { populate } = require('../models/memberModel')
const Member = require('../models/memberModel')
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
const viewMemberInDepartment = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const out = await Member.findById(memberId)
      .select('department')
      .populate({
        path: 'department',
        select: 'membersPerDepartment',
        populate: {
          path: 'membersPerDepartment',
        },
      })
    if (!out.department)
      return res.json({
        code: noDepartment,
        message: 'you have no Department ',
      })

    res.json(out)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const viewMemberInDepartment = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const out = await Member.findById(memberId)
      .select('department')
      .populate({
        path: 'department',
        select: 'membersPerDepartment',
        populate: {
          path: 'membersPerDepartment',
        },
      })
    // let array = []
    // out.department.membersPerDepartment.forEach((element) => {
    //   array.push({
    //     _id: element._id.toString(),
    //     name: element.name,
    //     dayoff: element.dayoff,
    //   })
    // })

    if (!out.department)
      return res.json({
        code: noDepartment,
        message: 'you have no Department ',
      })

    res.json(out.department.membersPerDepartment)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const viewAllMember_dayoff_InDepartment = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const out = await Member.findById(memberId)
      .select('department')
      .populate({
        path: 'department',
        select: 'membersPerDepartment',
        populate: {
          path: 'membersPerDepartment',
          select: 'dayoff name ',
        },
      })
    let array = []
    out.department.membersPerDepartment.forEach((element) => {
      array.push({
        _id: element._id.toString(),
        name: element.name,
        dayoff: element.dayoff,
      })
    })

    if (!out.department)
      return res.json({
        code: noDepartment,
        message: 'you have no Department ',
      })

    res.json(array)
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewMember_dayoff_InDepartment = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const memberIsExist = await Member.findById(req.body.memberId)
    if (!memberIsExist)
      return res.json({
        code: memberDoesnotExist,
        message: 'No Member by this Id ',
      })
    const out = await Member.findById(memberId)
      .select('department')
      .populate({
        path: 'department',
        select: 'membersPerDepartment',
        populate: {
          path: 'membersPerDepartment',
          select: 'dayoff name',
          match: { _id: req.body.memberId },
        },
      })
    if (!out.department)
      return res.json({
        code: noDepartment,
        message: 'your  department Does not exist',
      })
    console.log(out.department)
    let element = out.department.membersPerDepartment
    if (!element[0])
      return res.json({
        code: noDepartment,
        message: 'this member is not in your department',
      })

    res.json({
      _id: element[0]._id.toString(),
      name: element[0].name,
      dayoff: element[0].dayoff,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = {
  viewAllMember_dayoff_InDepartment,
  viewMember_dayoff_InDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  viewMemberInDepartment,
}
