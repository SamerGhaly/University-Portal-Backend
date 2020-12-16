const mongoose = require('mongoose')

const attendanceRecordSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  date: Date,
  type: String,
})

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema)
