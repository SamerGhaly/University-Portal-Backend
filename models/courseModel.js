const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name: String,
  slotsPerWeek: Number,
  department:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
  ],
})
courseSchema.virtual('slotsAssignments', {
  ref: 'SlotAssignment',
  localField: '_id',
  foreignField: 'course',
})
courseSchema.set('toObject', { virtuals: true })
courseSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Course', courseSchema)
