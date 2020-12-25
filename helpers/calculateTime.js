const { attendanceRecordTypes } = require('../constants/constants')
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

const checkValidLeave = (today) => {}


const checkCompensation = (today) => {}

const attendanceRecordsCheck = (attendanceRecords, today, dayoff) => {
  // check friday
  let missingDays = 0
  let time = calcHours(attendanceRecords, today)
  if (today.getDay() === 5) return { missingDays, time: 0 }
  else if (today.getDay() === dayoff && !checkCompensation(today))
    return { missingDays, time }
  else if (checkValidLeave(today)) return { missingDays, time: 0 }
  else if (checkCompensation(today) || time !== 0) {
    time -= convertTomilli(8, 25, 0)
    return { missingDays, time }
  } else if (time == 0) {
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
module.exports = { convertTohours, attendanceRecordsCheck, convertTomilli }
