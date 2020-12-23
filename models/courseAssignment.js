const mongoose = require('mongoose')
const courseAssignmentSchema = new mongoose.Schema({
  role: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

const Model = mongoose.model('CourseAssignment', courseAssignmentSchema)
module.exports = Model
