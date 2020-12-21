const AttendanceRecordModel = require('../models/attendanceRecordModel')

const { catchError, monthAndYearRequired } = require('../constants/errorCodes')

const viewAttendanceRecords = async (req, res) => {
  try {
    const filter = {}
    if (req.body.memberId) filter.member = req.body.memberId
    else filter.member = req.member.memberId
    if (
      (req.body.month && !req.body.year) ||
      (req.body.year && !req.body.month)
    ) {
      return res.status(400).json({
        code: monthAndYearRequired,
        message: 'Please add a month and a year',
      })
    }

    let month = req.body.month
    let year = req.body.year
    if (month && year) {
      const startDate = new Date(year, month - 1, 11)
      console.log(startDate.toDateString())
      if (month == 12) {
        year += 1
        month = 0
      }
      const endDate = new Date(year, month, 11)

      filter.$and = [
        {
          date: { $gt: startDate },
        },
        {
          date: { $lt: endDate },
        },
      ]

      console.log(filter.$and)
    }

    const attendanceRecs = await AttendanceRecordModel.find(filter)
    return res.json({
      data: attendanceRecs,
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
  viewAttendanceRecords,
}
