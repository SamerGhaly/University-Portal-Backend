const Joi = require('joi')
const { validationError } = require('../constants/errorCodes')
const { roomTypes } = require('../constants/constants')
const validateRoom = async (req, res, next) => {
  const roomSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string()
      .valid(
        roomTypes.HALL,
        roomTypes.LAB,
        roomTypes.TUTORIAL,
        roomTypes.OFFICE
      )
      .required(),
    capacity: Joi.number().required().min(1),
  })
  const checkSchema = roomSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }

  next()
}

const validateRoomU = (req, res, next) => {
  const roomSchema = Joi.object({
    roomId: Joi.string().length(24).required(),
    name: Joi.string(),
    type: Joi.string().valid(
      roomTypes.HALL,
      roomTypes.LAB,
      roomTypes.TUTORIAL,
      roomTypes.OFFICE
    ),
    capacity: Joi.number().min(1),
  })
  const checkSchema = roomSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

const validateRoomD = (req, res, next) => {
  const roomSchema = Joi.object({
    roomId: Joi.string().length(24).required(),
  })
  const checkSchema = roomSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  next()
}

module.exports = { validateRoom, validateRoomU, validateRoomD }
