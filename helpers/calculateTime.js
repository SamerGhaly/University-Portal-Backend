const { attendanceRecordTypes } = require('../constants/constants')
const { findOne } = require('../models/memberModel')
const Member = require('../models/memberModel')
const ChangeDayOffRequest = require('../models/changeDayOffRequest')
const sickRequest = require('../models/sickLeaveRequest')
const maternityRequest = require('../models/maternityLeaveRequest')
const AccidentalLeaveRequest = require('../models/accidentalLeaveRequest')
const annualLeaveRequest = require('../models/annualLeaveRequest')
const replacementRequest = require('../models/replacementRequest')

const calcHours = (attendanceRecords, today) => {
  //0==> sign i
  //1==> sign out
  let lastState = 1
  let LastSignIn = 0
  let ans = 0
  let lowerBound = today.getTime() + 7 * 60 * 60 * 1000
  let upperBound = today.getTime() + 19 * 60 * 60 * 1000
  attendanceRecords.forEach((element) => {
    let currTime = Math.min(element.date.getTime(), upperBound)
    //  console.log(currTime);
    currTime = Math.max(currTime, lowerBound)
    console.log(element.type)
    if (element.type === 'signin') {
      if (lastState == 1) {
        lastState = 0
        LastSignIn = currTime
        //    console.log("signin");
      }
    } else {
      //     console.log("signout");
      if (lastState == 0) {
        ans += currTime - LastSignIn
        lastState = 1
      }
    }
  })
  return ans
}
const checkDayInRange = (Request, day) => {
  let ans = Request.findOne({
    member: memberId,
    from: {
      $lte: day,
    },
    to: {
      $gte: day,
    },
  })
  return ans
}
const checkDay = (Request, day) => {
  let nextDay = new Date(day + 24 * 60 * 60 * 1000)
  let ans = Request.findOne({
    member: memberId,
    absentDate: {
      $gte: day,
      $lt,
      nextDay,
    },
  })
  return ans
}
// const ChangeDayOffRequest = require('../models/changeDayOffRequest')
// const sickRequest = require('../models/sickLeaveRequest')
// const maternityRequest = require('../models/maternityLeaveRequest')
// const AccidentalLeaveRequest = require('../models/accidentalLeaveRequest')
// const annualLeaveRequest = require('../models/annualLeaveRequest')
// const replacementRequest = require('../models/replacementRequest')
const checkRequestedDay = async (day, memberId) => {
  let hasARequest = 0
  hasARequest |= await checkDayInRange(sickRequest, day)
  hasARequest |= await checkDayInRange(maternityRequest, day)
  hasARequest |= await checkDayInRange(annualLeaveRequest, day)
  hasARequest |= await checkDay(AccidentalLeaveRequest, day)

  return hasARequest
}
const attendanceRecordsCheck = (attendanceRecords, today, dayoff, memberId) => {
  // check friday
  let missingDays = 0
  let time = calcHours(attendanceRecords, today)
  if (today.getDay() === 5) return { missingDays, time: 0 }

  if (today.getDay() === dayoff && !compancated) return { missingDays, time }

  if (checkRequestedDay(today, memberId)) return { missingDays, time: 0 }
  if (compancated || time !== 0) {
    time -= convertTomilli(8, 25, 0)
    return { missingDays, time }
  }
  if (time == 0) {
    missingDays = 1
    return { missingDays, time }
  }
  return { missingDays, time }
}
const convertTomilli = (hours, min, sec) => {
  return (hours * 60 * 60 + min * 60 + sec) * 1000
}
const convertTohours = (hours, min, sec) => {
  return (hours * 60 * 60 + min * 60 + sec) * 1000
}
const calcMemberanualLeavesLeft = (member) => {
  //Get Available days for member
  //console.log(member);
  const memberStartDate = member.dateCreated
  // console.log(typeof memberStartDate)

  const today = new Date()
  const diffInMonths = today.getMonth() - memberStartDate.getMonth()
  const diffInYears = today.getFullYear() - memberStartDate.getFullYear()
  let availableDays = (diffInMonths + 12 * diffInYears) * 2.5
  if (today.getDate() <= memberStartDate.getDate()) availableDays += 2.5

  availableDays -= member.annualBalanceTaken
  return availableDays
}
module.exports = {
  calcMemberanualLeavesLeft,
  convertTohours,
  attendanceRecordsCheck,
  convertTomilli,
}
