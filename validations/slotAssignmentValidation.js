const Joi = require('joi')
const { weekDays, slotTypes } = require('../constants/constants')
const { validationError } = require('../constants/errorCodes')

const validateAddSlot = (req, res, next) => {
  const addSlotSchema = Joi.object({
    course: Joi.string().length(24).required(),
    room: Joi.string().length(24).required(),
    slot: Joi.number().min(1).max(5).required(),
    day: Joi.string()
      .valid(
        weekDays.SATURDAY,
        weekDays.SUNDAY,
        weekDays.MONDAY,
        weekDays.TUESDAY,
        weekDays.WEDNESDAY,
        weekDays.THURSDAY
      )
      .required(),
    type: Joi.string()
      .valid(slotTypes.LAB, slotTypes.LECTURE, slotTypes.TUTORIAL)
      .required(),
  })

  const checkSchema = addSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateUpdateSlot = (req, res, next) => {
  const updateSlotSchema = Joi.object({
    assignmentId: Joi.string().required(),
    course: Joi.string().length(24),
    room: Joi.string().length(24),
    slot: Joi.number().min(1).max(5),
    day: Joi.string().valid(
      weekDays.SATURDAY,
      weekDays.SUNDAY,
      weekDays.MONDAY,
      weekDays.TUESDAY,
      weekDays.WEDNESDAY,
      weekDays.THURSDAY
    ),
    type: Joi.string().valid(
      slotTypes.LAB,
      slotTypes.LECTURE,
      slotTypes.TUTORIAL
    ),
  })

  const checkSchema = updateSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateDeleteSlot = (req, res, next) => {
  const deleteSlotSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
  })
  const checkSchema = deleteSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateAssignSlotToMember = (req, res, next) => {
  const assignSlotSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
    memberId: Joi.string().length(24).required(),
  })
  const checkSchema = assignSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateUpdateSlotAssignment = (req, res, next) => {
  const assignSlotSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
    newMemberId: Joi.string().length(24).required(),
  })
  const checkSchema = assignSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateDeleteSlotAssignment = (req, res, next) => {
  const assignSlotSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
  })
  const checkSchema = assignSlotSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

module.exports = {
  validateAddSlot,
  validateUpdateSlot,
  validateDeleteSlot,
  validateAssignSlotToMember,
  validateUpdateSlotAssignment,
  validateDeleteSlotAssignment,
}
