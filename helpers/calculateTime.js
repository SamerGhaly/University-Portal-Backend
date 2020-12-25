const {
  attendanceRecordTypes,
  weekDaysNumbers,
  requestType,
} = require('../constants/constants')
const { findOne } = require('../models/memberModel')
const Member = require('../models/memberModel')
const ChangeDayOffRequest = require('../models/changeDayOffRequest')
const sickRequest = require('../models/sickLeaveRequest')
const maternityRequest = require('../models/maternityLeaveRequest')
const AccidentalLeaveRequest = require('../models/accidentalLeaveRequest')
const annualLeaveRequest = require('../models/annualLeaveRequest')
const replacementRequest = require('../models/replacementRequest')
const compensationLeaveRequest = require('../models/compensationLeaveRequest')

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
    // console.log(element.type)
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
const checkDayInRange = async (Request, day, memberId) => {
  let ans = await Request.findOne({
    member: memberId,
    from: {
      $lte: day,
    },
    to: {
      $gte: day,
    },
    status: requestType.ACCEPT,
  })
  console.log('annual', ans)
  return ans
}
const checkDay = async (Request, day, memberId) => {
  let nextDay = new Date(day + 24 * 60 * 60 * 1000)
  let ans = await Request.findOne({
    member: memberId,
    absentDate: {
      $gte: day,
      $lt: nextDay,
    },
    status: requestType.ACCEPT,
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
  let hasARequest = false
  const checkSick = await checkDayInRange(sickRequest, day, memberId)
  const checkMaternity = await checkDayInRange(maternityRequest, day, memberId)
  const checkAnnual = await checkDayInRange(annualLeaveRequest, day, memberId)
  const checkAccidental = await checkDay(AccidentalLeaveRequest, day, memberId)
  if (checkSick || checkMaternity || checkAnnual || checkAccidental)
    hasARequest = true
  return hasARequest
}
const attendanceRecordsCheck = async (attendanceRecords, today, member) => {
  // check friday
  let missingDays = 0
  const memberId = member._id
  const dayoff = member.dayoff
  let time = calcHours(attendanceRecords, today)
  //   console.log(time)
  let compancated = await checkDay(compensationLeaveRequest, today, memberId)
  if (today.getDay() === 5) return { missingDays, time: 0 }

  if (weekDaysNumbers[today.getDay()] === dayoff && !compancated)
    return { missingDays, time }
  let hasVacancy = await checkRequestedDay(today, memberId)
  console.log('hasVacancy', hasVacancy)
  if (hasVacancy) return { missingDays, time: 0 }
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
const convertToHours_min_sec = (milli) => {
  let sec = 1000
  let min = 1000 * 60
  let hour = 1000 * 60 * 60
  let hours = Math.floor(milli / hour)
  let mins = Math.floor((milli % hour) / min)
  let secs = ((milli % hour) % min) / sec
  return { hours, mins, secs }
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
  if (today.getDate() >= memberStartDate.getDate()) availableDays += 2.5

  availableDays -= member.annualBalanceTaken
  return availableDays
}

module.exports = {
  calcMemberanualLeavesLeft,
  attendanceRecordsCheck,
  convertTomilli,
  convertToHours_min_sec,
}
