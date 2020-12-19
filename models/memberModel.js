const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  customId: String,
  type: String,
  dayoff: String,
  salary: Number,
  birthdate: Date,
  activated: Boolean,
  gender: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
})

memberSchema.virtual('attendanceRecords', {
  ref: 'AttendanceRecord',
  localField: '_id',
  foreignField: 'member',
})

memberSchema.virtual('schedule', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'member',
})

memberSchema.set('toObject', { virtuals: true })
memberSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Member', memberSchema)
