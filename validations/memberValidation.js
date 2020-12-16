const Joi = require('joi')

const { validationError } = require('../constants/errorCodes')

const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })

  const checkValidSchema = loginSchema.validate(req.body)
  if (checkValidSchema.error) {
    return res.json({
      code: validationError,
      message: checkValidSchema.error.details[0],
    })
  }
  next()
}

const validateAddMember = (req, res, next) => {
  const addMemberSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
  })
  const checkSchema = addMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      message: 'Wrong Body',
    })
  }
  next()
}

module.exports = {
  validateLogin,
  validateAddMember,
}
