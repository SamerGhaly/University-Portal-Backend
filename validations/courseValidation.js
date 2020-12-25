const Joi = require('joi')
const { slotNumberNotValid } = require('../constants/constants')
const { validationError } = require('../constants/errorCodes')

const validateCourse = (req, res, next) => {
  const courseSchema = Joi.object({
    name: Joi.string().required(),
    slotsPerWeek: Joi.number().required(),
    departmentId: Joi.string().length(24).required(),
  })
  if (req.body.slotsPerWeek <= 0)
    return res.status(400).json({
      code: slotNumberNotValid,
      message: 'invalid slotsPerWeek',
    })
  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateCourseU = (req, res, next) => {
  const courseSchema = Joi.object({
    courseId: Joi.string().length(24).required(),
    name: Joi.string(),
    slotsPerWeek: Joi.number(),
    departmentIdRemoved: Joi.string().length(24),
    departmentIdAdded: Joi.string().length(24),
  })
  if (req.body.slotsPerWeek <= 0)
    return res.status(400).json({
      code: slotNumberNotValid,
      message: 'invalid slotsPerWeek',
    })
  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateCourseInstructor = (req, res, next) => {
  const courseSchema = Joi.object({
    courseId: Joi.string().length(24).required(),
    instructorId: Joi.string().length(24).required(),
  })
  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateCourseInstructorU = (req, res, next) => {
  const courseSchema = Joi.object({
    courseAssignmentId: Joi.string().length(24).required(),
    newInstructorId: Joi.string().length(24).required(),
  })
  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateCourseInstructorD = (req, res, next) => {
  const courseSchema = Joi.object({
    courseAssignmentId: Joi.string().length(24).required(),
  })
  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateMemberPerCourse = (req, res, next) => {
  const courseSchema = Joi.object({
    courseId: Joi.string().length(24).required(),
  })

  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  next()
}

const validateMemberPerAllCoursesorSpecific = (req, res, next) => {
  const courseSchema = Joi.object({
    courseId: Joi.string().length(24),
  })

  const checkSchema = courseSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

module.exports = {
  validateMemberPerCourse,
  validateCourse,
  validateCourseU,
  validateCourseInstructor,
  validateCourseInstructorU,
  validateMemberPerAllCoursesorSpecific,
  validateCourseInstructorD,
}
