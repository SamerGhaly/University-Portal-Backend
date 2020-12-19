const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
  name: String,
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  },
  headOfDepartment: {
    ref: 'Member',
    type: mongoose.Schema.Types.ObjectId,
  },
})

departmentSchema.virtual('membersPerDepartment', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'department',
})

departmentSchema.virtual('coursesPerDepartment', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'departments',
})

departmentSchema.set('toObject', { virtuals: true })
departmentSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Department', departmentSchema)
