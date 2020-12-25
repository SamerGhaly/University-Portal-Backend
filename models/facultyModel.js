const mongoose = require('mongoose')
const departmentModel = require('./departmentModel')

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

facultySchema.post(
  'findByIdAndRemove findByIdAndDelete findOneAndDelete',
  async (doc) => {
    console.log(doc)
    await departmentModel.updateMany(
      { faculty: doc._id },
      { $unset: { faculty: '' } }
    )
  }
)

module.exports = mongoose.model('Faculty', facultySchema)
