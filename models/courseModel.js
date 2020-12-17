const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name: String,
  semester: Number,
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
})

module.exports = mongoose.model('Course', courseSchema)
