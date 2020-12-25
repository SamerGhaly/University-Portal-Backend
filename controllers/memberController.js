require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const invalidateToken = require('../helpers/invalidateToken')
const AttendanceRecordModel = require('../models/attendanceRecordModel')
const MemberModel = require('../models/memberModel')
const RoomModel = require('../models/roomModel')
const DepartmentModel = require('../models/departmentModel')
const CourseModel = require('../models/courseModel')
const courseAssignmentModel = require('../models/courseAssignment')
const {
  attendanceRecordsCheck,
  convertToHours_min_sec,
} = require('../helpers/calculateTime')
const {
  userNotFound,
  unActivatedAccount,
  emailAlreadyExists,
  catchError,
  memberAlreadyActivated,
  unauthorized,
  cannotEditFields,
  dayOffError,
  hrCannotAddRecToThemselves,
  roomDoesnotExist,
  roomIsFull,
  roomNotOffice,
  IdnotFound,
  notTA,
  differentDepartments,
  courseDoesNotExist,
  assignmentAlreadyThere,
  mustBeTaFirst,
  coordinatorAlreadyAssignment,
  assignmentDoesNotExist,
  instructorNotInCourse,
} = require('../constants/errorCodes')
const {
  memberRoles,
  attendanceRecordTypes,
  roomTypes,
  weekDays,
} = require('../constants/constants')
const attendanceRecordModel = require('../models/attendanceRecordModel')
const departmentModel = require('../models/departmentModel')

const login = async (req, res) => {
  try {
    const memberFound = await MemberModel.findOne({ email: req.body.email })
    if (!memberFound) {
      return res.json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }

    if (!memberFound.activated) {
      return res.json({
        code: unActivatedAccount,
        message: 'Please Activate the account first before login',
      })
    }

    const checkPass = await bcrypt.compareSync(
      req.body.password,
      memberFound.password
    )
    if (!checkPass) {
      return res.status(401).json({
        message: 'Wrong Password',
      })
    }
    const payload = {}
    payload.memberId = memberFound._id
    payload.type = memberFound.type

    const token = await jwt.sign(payload, process.env.SIGNING_KEY, {
      expiresIn: '8h',
    })
    res.header('auth-token', token)
    return res.json({
      message: 'Logged in successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const logout = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const token = req.headers['auth-token']
    const expDate = new Date(jwt.decode(token).exp * 1000)
    const blacklistToken = await invalidateToken(token, tokenId, expDate)
    if (blacklistToken)
      return res.json({
        message: 'Logged out successfully',
      })
    return res.json({
      message: 'Could Not Logout',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const addMember = async (req, res) => {
  try {
    const member = req.body
    //Check if email is unique
    const checkMemberFound = await MemberModel.findOne({ email: member.email })
    if (checkMemberFound) {
      return res.json({
        code: emailAlreadyExists,
        message: 'Email already Exists',
      })
    }
    //Check if office has capacity
    const officeFound = await RoomModel.findById(req.body.office)
    if (!officeFound) {
      return res.status(404).json({
        code: roomDoesnotExist,
        message: 'Room Does Not Exist',
      })
    }
    if (officeFound.type !== roomTypes.OFFICE) {
      return res.status(400).json({
        code: roomNotOffice,
        message: 'Room is not an office',
      })
    }
    const officeCapacity = await MemberModel.countDocuments({
      office: req.body.office,
    })
    if (officeCapacity === officeFound.capacity) {
      return res.json({
        code: roomIsFull,
        message: 'Room is Already Full',
      })
    }

    let customId
    if (member.type === 'hr') {
      const lastHr = await MemberModel.findOne({ type: 'hr' }, null, {
        sort: { customId: -1 },
      })
      if (lastHr) {
        const lastHRCustomId = lastHr.customId.split('-')
        const newHrId = Number(lastHRCustomId[1]) + 1
        customId = 'hr-' + newHrId
        if (member.dayoff !== weekDays.SATURDAY) {
          return res.json({
            code: dayOffError,
            message: 'HR dayoff must be Saturday',
          })
        }
      } else customId = 'hr-1'
    } else {
      const lastAc = await MemberModel.findOne(
        {
          type: { $ne: 'hr' },
        },
        null,
        { sort: { customId: -1 } }
      )
      if (lastAc) {
        const lastAcCustomId = lastAc.customId.split('-')
        const newAcId = Number(lastAcCustomId[1]) + 1
        customId = 'ac-' + newAcId
      } else customId = 'ac-1'

      const depFound = await DepartmentModel.findById(req.body.department)
      if (!depFound) {
        return res.status(404).json({
          code: IdnotFound,
          message: 'Department Does Not Exist!',
        })
      }
    }
    const salt = parseInt(process.env.SALT)
    // console.log(typeof salt)
    member.password = bcrypt.hashSync('123456')
    // console.log(member.password)
    member.activated = false
    member.customId = customId
    member.dateCreated = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
    member.annualBalanceTaken = 0
    member.accidentalDaysTaken = 0
    const createdMember = await MemberModel.create(member)
    return res.json({
      message: 'Member Added',
      data: createdMember,
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'Member Does Not Exist',
      })
    }
    if (memberFound.activated) {
      return res.json({
        code: memberAlreadyActivated,
        message: 'Member Already Activated',
      })
    }
    memberFound.activated = true
    memberFound.password = await bcrypt.hashSync(req.body.newPassword, 10)
    await memberFound.save()
    return res.json({
      message: 'Account Activated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateMember = async (req, res) => {
  try {
    const userType = req.member.type
    const userId = req.member.memberId
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'Member Not Found',
      })
    }
    // Can update name,email,salary,department,birthdate,office
    if (userType === memberRoles.HR) {
      if (req.body.name) memberFound.name = req.body.name
      if (req.body.salary) memberFound.salary = req.body.salary
      if (req.body.type) memberFound.type = req.body.type
      if (req.body.gender) memberFound.gener = req.body.gender
    }
    // Can update name,email,salary,department,birthdate,office
    else {
      if (memberFound._id.toString() !== userId) {
        return res.status(403).json({
          code: unauthorized,
          message: 'You are not authorized to change other members details',
        })
      }
      if (
        req.body.name ||
        req.body.salary ||
        req.body.department ||
        req.body.type ||
        req.body.gender ||
        req.body.office
      ) {
        return res.status(400).json({
          code: cannotEditFields,
          message:
            'You cannot edit name, department,office,type,gender or salary',
        })
      }
    }
    if (req.body.email) memberFound.email = req.body.email
    if (req.body.birthdate) memberFound.birthdate = req.body.birthdate
    if (req.body.department) {
      const depFound = await DepartmentModel.findById(req.body.department)
      if (!depFound) {
        return res.status(404).json({
          code: IdnotFound,
          message: 'Department Not Found',
        })
      }
      memberFound.department = req.body.department
    }
    if (req.body.office) {
      const officeFound = await RoomModel.findById(req.body.office)
      if (!officeFound) {
        return res.status(404).json({
          code: roomDoesnotExist,
          message: 'Room Does Not Exist',
        })
      }
      if (officeFound.type !== roomTypes.OFFICE) {
        return res.status(400).json({
          code: roomNotOffice,
          message: 'Room is not an office',
        })
      }
      memberFound.office = req.body.office
    }
    await MemberModel.findByIdAndUpdate(memberFound._id, memberFound)
    return res.json({
      message: 'Member Updated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewMember = async (req, res) => {
  try {
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    memberFound.password = undefined
    return res.json({
      data: memberFound,
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const signIn = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const checkMember = await MemberModel.findById(memberId)
    if (!checkMember) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    let currentDate = new Date()
    currentDate = new Date(
      currentDate.setTime(currentDate.getTime() + 2 * 60 * 60 * 1000)
    )
    // const start = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth(),
    //   currentDate.getDate(),
    //   9,
    //   0,
    //   0
    // )

    // const end = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth(),
    //   currentDate.getDate(),
    //   21,
    //   0,
    //   0
    // )

    // if (currentDate < start || currentDate > end) {
    //   return res.json({
    //     code: cannotSignInNow,
    //     message: 'Signing in is only allowed between 7 am and 7 pm',
    //   })
    // }

    // const checkLastAction = await attendanceRecordModel.findOne(
    //   { member: memberId },
    //   null,
    //   { sort: { date: -1 } }
    // )
    // if (
    //   checkLastAction &&
    //   checkLastAction.type === attendanceRecordTypes.SIGN_IN
    // ) {
    //   return res.json({
    //     code: signInError,
    //     message: 'Cannot Sign in again before siging out',
    //   })
    // }

    const newSignIn = {
      type: attendanceRecordTypes.SIGN_IN,
      date: currentDate,
      member: memberId,
    }
    await AttendanceRecordModel.create(newSignIn)
    return res.json({
      message: 'Signed In successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const signOut = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const checkMember = await MemberModel.findById(memberId)
    if (!checkMember) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    let currentDate = new Date()
    currentDate = new Date(
      currentDate.setTime(currentDate.getTime() + 2 * 60 * 60 * 1000)
    )
    // const checkLastAction = await attendanceRecordModel.findOne(
    //   { member: memberId },
    //   null,
    //   { sort: { date: -1 } }
    // )
    // if (
    //   checkLastAction &&
    //   checkLastAction.type === attendanceRecordTypes.SIGN_OUT
    // ) {
    //   return res.json({
    //     code: signOutError,
    //     message: 'Cannot Sign out again before siging in',
    //   })
    // }
    const newSignOut = {
      type: attendanceRecordTypes.SIGN_OUT,
      date: currentDate,
      member: memberId,
    }
    await AttendanceRecordModel.create(newSignOut)
    return res.json({
      message: 'Signed Out successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const addMissingSign = async (req, res) => {
  try {
    const memberId = req.body.memberId
    const userId = req.member.memberId //from token
    if (memberId === userId.toString()) {
      return res.status(403).json({
        code: hrCannotAddRecToThemselves,
        message: 'HR cannot add attendance records to themselves',
      })
    }
    const checkMember = await MemberModel.findById(memberId)
    if (!checkMember) {
      return res.status(404).json({
        message: 'User Not Found',
        code: userNotFound,
      })
    }
    const dateArr = req.body.date.split('-')
    const timeArr = req.body.time.split(':')

    const newDate = new Date(
      dateArr[0],
      Number(dateArr[1]) - 1,
      dateArr[2],
      Number(timeArr[0]) + 2,
      timeArr[1],
      0
    )
    const type = req.body.type
    const newSign = {
      type,
      member: memberId,
      date: newDate,
    }
    await AttendanceRecordModel.create(newSign)
    return res.json({
      message: 'Missing sign added successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteMember = async (req, res) => {
  try {
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'Member Not Found',
      })
    }
    await MemberModel.findByIdAndDelete({ _id: req.body.memberId })
    return res.json({
      message: 'Member Deleted Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const assignTaToCourse = async (req, res) => {
  try {
    const instructorId = req.member.memberId
    const memberFound = await MemberModel.findById(req.body.member)
    //Check Member in DB
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    //check member is a TA
    if (memberFound.type !== memberRoles.TA) {
      return res.status(400).json({
        code: notTA,
        message: 'Only TAs can be assigned',
      })
    }
    // check Course is in DB
    const courseFound = await CourseModel.findById(req.body.course)
    if (!courseFound) {
      return res.status(404).json({
        code: courseDoesNotExist,
        message: 'Course Not Found',
      })
    }

    const instructorFound = await MemberModel.findById(instructorId)
    //Check instructor belongs to same department
    if (!courseFound.department.includes(instructorFound.department)) {
      return res.status(400).json({
        code: differentDepartments,
        message: 'Course And Instructor must be in the same department',
      })
    }

    //Check course and TA must be in same department
    if (!courseFound.department.includes(memberFound.department)) {
      return res.status(400).json({
        code: differentDepartments,
        message: 'Course And Ta must be in the same department',
      })
    }

    //Check if Ta is already assigned
    const assignFound = await courseAssignmentModel.findOne({
      member: req.body.member,
      course: req.body.course,
    })

    if (assignFound) {
      return res.status(400).json({
        code: assignmentAlreadyThere,
        message: 'This assignment is already there',
      })
    }
    //Check the instructor is assigned to course
    const checkInstructorInCourse = await courseAssignmentModel.findOne({
      member: instructorId,
      course: req.body.course,
    })
    if (!checkInstructorInCourse) {
      return res.json({
        code: instructorNotInCourse,
        message: 'Instructor Does Not Teach Course',
      })
    }

    const assign = req.body
    assign.role = memberRoles.TA
    await courseAssignmentModel.create(assign)
    return res.json({
      message: 'Course Assignment created successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const assignCoorinatorToCourse = async (req, res) => {
  try {
    const instructorId = req.member.memberId
    const memberFound = await MemberModel.findById(req.body.member)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    if (memberFound.type !== memberRoles.TA) {
      return res.status(400).json({
        code: notTA,
        message: 'Only TAs can be assigned',
      })
    }
    const courseFound = await CourseModel.findById(req.body.course)
    if (!courseFound) {
      return res.status(404).json({
        code: courseDoesNotExist,
        message: 'Course Not Found',
      })
    }

    const instructorFound = await MemberModel.findById(instructorId)

    //Check instructor teaches the course
    const checkCourseInstructor = await courseAssignmentModel.findOne({
      course: req.body.course,
      member: instructorId,
    })
    if (!checkCourseInstructor) {
      return res.json({
        code: instructorNotInCourse,
        message: 'Instructor Does Not Teach Course',
      })
    }
    if (!courseFound.department.includes(instructorFound.department)) {
      return res.status(400).json({
        code: differentDepartments,
        message: 'Course And Instructor must be in the same department',
      })
    }
    if (!courseFound.department.includes(memberFound.department)) {
      return res.status(400).json({
        code: differentDepartments,
        message: 'Course And Ta must be in the same department',
      })
    }
    const assignFound = await courseAssignmentModel.findOne({
      member: req.body.member,
      course: req.body.course,
    })
    if (!assignFound) {
      return res.status(404).json({
        code: mustBeTaFirst,
        message: 'Coordinator must be assigned as TA first',
      })
    }
    if (assignFound.role === memberRoles.COORDINATOR) {
      return res.status(400).json({
        code: assignmentAlreadyThere,
        message: 'This assignment is already there',
      })
    }
    const checkAnotherCoordinator = await courseAssignmentModel.findOne({
      course: req.body.course,
      role: memberRoles.COORDINATOR,
    })
    console.log(checkAnotherCoordinator)
    if (checkAnotherCoordinator) {
      return res.json({
        code: coordinatorAlreadyAssignment,
        message: 'Course already has coordinator',
      })
    }
    const assign = req.body
    assign.role = memberRoles.COORDINATOR
    await courseAssignmentModel.findByIdAndUpdate(assignFound._id, assign)
    return res.json({
      message: 'Course Assignment created successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateTaAssignment = async (req, res) => {
  try {
    const memberId = req.body.newMemberId
    const checkOldAssign = await courseAssignmentModel.findById(
      req.body.assignmentId
    )
    //Check if assignment exists
    if (!checkOldAssign) {
      return res.json({
        code: assignmentDoesNotExist,
        message: 'Assignment Does Not Exist',
      })
    }
    const instructorId = await MemberModel.findById(req.member.memberId)

    //check if instructor is assigned to course
    const checkInstructorInCourse = await courseAssignmentModel.findOne({
      course: checkOldAssign.course,
      member: instructorId,
    })

    if (!checkInstructorInCourse) {
      return res.json({
        code: instructorNotInCourse,
        message: 'Instructor cannot edit course',
      })
    }

    //Check if member exists
    const checkMember = await MemberModel.findById(memberId)
    if (!checkMember) {
      return res.json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    // check new member is a TA
    if (checkMember.type !== memberRoles.TA) {
      return res.json({
        code: notTA,
        message: 'Only TAs can be assigned by instructor',
      })
    }

    checkOldAssign.member = memberId
    await courseAssignmentModel.findByIdAndUpdate(
      checkOldAssign._id,
      checkOldAssign
    )
    return res.json({
      message: 'Course Assignment Updated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const removeTaAssignment = async (req, res) => {
  try {
    const checkAssignment = await courseAssignmentModel.findById(
      req.body.assignmentId
    )
    if (!checkAssignment) {
      return res.json({
        code: assignmentDoesNotExist,
        code: 'This Assignment Does Not Exist',
      })
    }
    const instructorId = req.member.memberId //from token
    //check instructor on course
    const checkInstructorInCourse = await courseAssignmentModel.findOne({
      member: instructorId,
      course: checkAssignment.course,
    })
    if (!checkInstructorInCourse) {
      return res.json({
        code: instructorNotInCourse,
        message: 'Only Instructors on this course can remove TAs',
      })
    }

    if (
      checkAssignment.role !== memberRoles.TA &&
      checkAssignment.role !== memberRoles.COORDINATOR
    ) {
      return res.json({
        code: notTA,
        message: 'Only TAs or coordinators can be removed by instructor!',
      })
    }
    await courseAssignmentModel.findByIdAndDelete(req.body.assignmentId)
    return res.json({
      message: 'Assignment Removed Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const getUpdatedSalary = async (req, res) => {
  let tokenId
  if (req.body.memberId) tokenId = req.body.memberId
  else tokenId = req.member.memberId
  const member = await MemberModel.findById(tokenId)
  if(!member)
  return res.json({
    message: ' member DoesnotExist',
    code: memberDoesnotExist,
  })
  let Salary = member.salary
  let salaryDeducted = 0
  let ans = await viewMissingDaysHours(req, res)
  if (-ans.time <= 10800000 - 59 * 1000) {
    console.log("hhay");
    return res.json({
      Salary,
      salaryDeducted:0,
      result:Salary-salaryDeducted
    })
  }
  let time = convertToHours_min_sec(-ans.time)
//console.log((Salary / 180),ans.MissingDays);
  salaryDeducted +=
    time['hours'] * (Salary / 180) + time['mins'] * (Salary / (180 * 60))

  salaryDeducted += ans.missingDays * (Salary / 60)
  return res.json({
    Salary,
    salaryDeducted,
    result:Salary-salaryDeducted
  })
}
const viewMissingDaysHoursHR = async (req, res) => {
  let ans = await viewMissingDaysHours(req, res)
  let result = {}
  let time = convertToHours_min_sec(ans.time)
  if (ans.time > 0) {
    result.ExtraHours_minutes = convertToHours_min_sec(ans.time)
  } else {
    result.MissingHours_minutes = convertToHours_min_sec(-ans.time)
  }
  result.MissingDays = ans.missingDays
  return res.json({
    result,
  })
}
const viewTime = async (req, res) => {
  let ans = await viewMissingDaysHours(req, res)
  let result = {}
  let time = convertToHours_min_sec(ans.time)
  if (ans.time > 0) {
    result.ExtraHours_minutes = convertToHours_min_sec(ans.time)
  } else {
    result.MissingHours_minutes = convertToHours_min_sec(-ans.time)
  }
  return res.json({
    result,
  })
}
const viewMissingDays = async (req, res) => {
  let ans = await viewMissingDaysHours(req, res)
  return res.json({
    MissingDays: ans.missingDays,
  })
}

const viewMissingDaysHours = async (req, res) => {
  try {
    let tokenId
    if (req.body.memberId) tokenId = req.body.memberId
    else tokenId = req.member.memberId
    let currentYear = new Date().getFullYear()
    let currentMonth
    let startDate
    let endDate
    currentMonth =
      new Date().getDate() >= 11
        ? new Date().getMonth()
        : new Date().getMonth() - 1
    if (currentMonth === -1) {
      currentMonth = 11
      currentYear = currentYear - 1
      startDate = new Date(currentYear, currentMonth, 11)
      endDate = new Date(currentYear + 1, 0, 11)
    } else {
      startDate = new Date(currentYear, currentMonth, 11)
      endDate = new Date(currentYear, currentMonth + 1, 11)
    }
    //
    let today = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )

    let startDay = startDate.getTime() + 2 * 60 * 60 * 1000
    let endDay = today.getTime()
    let stepTime = 24 * 60 * 60 * 1000
    let ans = { missingDays: 0, time: 0 }

    let attendanceRecords = await AttendanceRecordModel.find(
      {
        member: tokenId,
        date: { $gt: new Date(startDay), $lt: new Date(endDay) },
      },
      null,
      { sort: { date: 1 } }
    )
    let lastIdx = 0
    let member = await MemberModel.findById(tokenId)
    for (
      let DayTime = startDay + stepTime;
      DayTime <= endDay + stepTime;
      DayTime += stepTime
    ) {
      DayRecords = []
      for (let i = lastIdx; i < attendanceRecords.length; i++) {
        if (
          attendanceRecords[i].date > DayTime - stepTime &&
          attendanceRecords[i].date < DayTime
        ) {
          DayRecords.push(attendanceRecords[i])
        } else {
          lastIdx = i
          break
        }
      }
      let x = await attendanceRecordsCheck(
        DayRecords,
        new Date(DayTime - stepTime),
        member
      )
      console.log('ans', x)
      ans.missingDays += x.missingDays
      ans.time += x.time

      console.log(
        new Date(DayTime - stepTime - 1000).toDateString(),
        new Date(DayTime).toDateString()
        // attendanceRecords
      )
    }
    return ans
    //  console.log(currentMonth, currentYear, startDate, endDate)
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = {
  addMember,
  login,
  logout,
  updateMember,
  viewMember,
  resetPassword,
  signIn,
  signOut,
  addMissingSign,
  deleteMember,
  assignTaToCourse,
  updateTaAssignment,
  removeTaAssignment,
  assignCoorinatorToCourse,
  viewMissingDaysHours,
  viewMissingDays,
  viewTime,
  viewMissingDaysHoursHR,
  getUpdatedSalary
}
