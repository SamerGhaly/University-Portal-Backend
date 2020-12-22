const Joi = require('joi')

const validateSlotLinkingRequest = (req, res, next) => {
  const slotLinkingSchema = Joi.object({
    slotId: Joi.string().length(24).required(),
  })
  const checkSchema = slotLinkingSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: checkSchema,
      message: checkSchema.error.details[0],
    })
  next()
}

module.exports = { validateSlotLinkingRequest }
