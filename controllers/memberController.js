require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const AttendanceRecordModel = require('../models/attendanceRecordModel')
const MemberModel = require('../models/memberModel')

const {
  userNotFound,
  unActivatedAccount,
  emailAlreadyExists,
  catchError,
  memberAlreadyActivated,
  unauthorized,
  cannotEditFields,
  hrDayOff,
  passwordsNotIdentical,
  signInError,
  signOutError,
  hrCannotAddRecToThemselves,
} = require('../constants/errorCodes')
const { memberRoles, attendanceRecordTypes } = require('../constants/constants')
const attendanceRecordModel = require('../models/attendanceRecordModel')

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
    return res.json({
      token,
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

  let customId
  if (member.type === 'hr') {
    const countHR = await MemberModel.countDocuments({ type: 'hr' })
    if (member.dayoff !== 'Saturday') {
      return res.json({
        code: hrDayOff,
        message: 'HR dayoff must be Saturday',
      })
    }
    member.dayoff = 'Saturday'
    customId = 'hr-' + (countHR + 1)
  } else {
    const countAcademic = await MemberModel.countDocuments({
      type: { $ne: 'hr' },
    })
    customId = 'ac-' + (countAcademic + 1)
  }
  member.password = await bcrypt.hashSync('123456', Number(process.env.SALT))
  member.activated = false
  member.customId = customId
  const createdMember = await MemberModel.create(member)
  return res.json({
    message: 'Member Added',
    data: createdMember,
  })
}

const activateAccount = async (req, res) => {
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
    memberFound.password = await bcrypt.hashSync(
      req.body.newPassword,
      Number(process.env.SALT)
    )
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
      if (req.body.department) memberFound.department = req.body.department
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
        req.body.gender
      ) {
        return res.status(400).json({
          code: cannotEditFields,
          message: 'You cannot edit name, department or salary',
        })
      }
    }
    if (req.body.email) memberFound.email = req.body.email
    if (req.body.birthdate) memberFound.birthdate = req.body.birthdate
    if (req.body.office) {
      //Check for office capacity !!! Waiting Samer
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

const resetPassword = async (req, res) => {
  try {
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    const checkPass = await bcrypt.compareSync(
      req.body.oldPassword,
      memberFound.password
    )
    if (!checkPass) {
      return res.status(400).json({
        code: passwordsNotIdentical,
        message: 'Old Password is wrong!',
      })
    }
    memberFound.password = await bcrypt.hashSync(req.body.newPassword)
    await MemberModel.findByIdAndUpdate(memberFound._id, memberFound)
    return res.json({
      message: 'Password Changed Successfuly',
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
    const memberId = req.body.memberId
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
    const memberId = req.body.memberId
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
    console.log(dateArr)
    console.log(timeArr)
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

module.exports = {
  addMember,
  login,
  activateAccount,
  updateMember,
  viewMember,
  resetPassword,
  signIn,
  signOut,
  addMissingSign,
}
