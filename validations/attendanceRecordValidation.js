const Joi = require('joi')
const { months } = require('../constants/constants')
const { validationError } = require('../constants/errorCodes')

const validateViewMyAttendanceRecords = (req, res, next) => {
  const viewSchema = Joi.object({
    month: Joi.number().min(1).max(12),
    year: Joi.number(),
  })
  const checkSchema = viewSchema.validate(req.body)

  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateViewMemberAttendanceRecords = (req, res, next) => {
  const viewSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
    month: Joi.number().min(1).max(12),
    year: Joi.number(),
  })
  const checkSchema = viewSchema.validate(req.body)

  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

module.exports = {
  validateViewMyAttendanceRecords,
  validateViewMemberAttendanceRecords,
}
