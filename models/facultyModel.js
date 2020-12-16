const mongoose = require('mongoose')

const facultySchema = new mongoose.Schema({
  name: String,
})

facultySchema.virtual('departmentsPerFaculty', {
  ref: 'Department',
  localField: '_id',
  foreignField: 'faculty',
})

facultySchema.set('toObject', { virtuals: true })
facultySchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Faculty', facultySchema)
