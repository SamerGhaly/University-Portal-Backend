const Joi = require('joi')

const { validationError } = require('../constants/errorCodes')

const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  const checkSchema = loginSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: checkSchema,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateAddMember = (req, res, next) => {
  const addMemberSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    // office: Joi.string().required(), //To be adjusted to real objectId
    salary: Joi.string().required(),
    // department: Joi.string(),
    dayoff: Joi.string().required(),
    type: Joi.string().required(),
    birthdate: Joi.date(),
    gender: Joi.string().required(),
  })
  const checkSchema = addMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateActivateAccount = (req, res, next) => {
  const activateAccountSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
    newPassword: Joi.string().required(),
  })
  const checkSchema = activateAccountSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateUpdateMember = (req, res, next) => {
  const updateMemberSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
    department: Joi.string().length(24),
    office: Joi.string().length(24),
    salary: Joi.number(),
    name: Joi.string(),
    email: Joi.string(),
    birthdate: Joi.date(),
    gender: Joi.string(),
  })
  const checkSchema = updateMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateViewMember = (req, res, next) => {
  const viewMemberSchema = Joi.object({
    memberId: Joi.string().required(),
  })
  const checkSchema = viewMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateResetPassword = (req, res, next) => {
  const validateResetPasswordSchema = Joi.object({
    memberId: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  })
  const checkSchema = validateResetPasswordSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

module.exports = {
  validateLogin,
  validateAddMember,
  validateActivateAccount,
  validateUpdateMember,
  validateViewMember,
  validateResetPassword,
}
