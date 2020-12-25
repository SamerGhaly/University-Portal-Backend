const {
  IdnotFound,
  noDepartment,
  memberDoesnotExist,
} = require('../constants/errorCodes')
const departmentModel = require('../models/departmentModel')
const Department = require('../models/departmentModel')
const facultyModel = require('../models/facultyModel')
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

const updateDepartment = async (req, res) => {
  try {
    const depFound = await departmentModel.findById(req.body.id)
    if (!depFound) {
      return res.status(404).json({
        code: IdnotFound,
        message: 'Department Does NOt Exist',
      })
    }

    const newDep = {}

    if (req.body.name) newDep.name = req.body.name
    if (req.body.faculty) {
      const facultyFound = await facultyModel.findById(req.body.faculty)
      if (!facultyFound) {
        return res.status(404).json({
          code: IdnotFound,
          message: 'Faculty Does NOt Exist',
        })
      }
      newDep.faculty = req.body.faculty
    }

    await departmentModel.findByIdAndUpdate(req.body.id, newDep)
    return res.json({ message: 'Department updated' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const depFound = await departmentModel.findById(req.body.id)
    if (!depFound) {
      return res.status(404).json({
        code: IdnotFound,
        message: 'Department Does NOt Exist',
      })
    }
    await Department.findOneAndDelete({ _id: req.body.id }, function (err) {
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
const viewAllMemberInDepartment = async (req, res) => {
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
