const Joi = require('joi')
const { validationError } = require('../constants/errorCodes')
const { weekDays } = require('../constants/constants')

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

const validateAcceptRejectLinkingRequest = (req, res, next) => {
  const slotLinkingSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
  })
  const checkSchema = slotLinkingSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: checkSchema,
      message: checkSchema.error.details[0],
    })
  next()
}

const validateViewSlotLinkingRequest = (req, res, next) => {
  const viewSlotLinkingSchema = Joi.object({
    courseId: Joi.string().length(24).required(),
  })
  const checkSchema = viewSlotLinkingSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: checkSchema,
      message: checkSchema.error.details[0],
    })
  next()
}

const validateChangeDayOffRequest = (req, res, next) => {
  const changeDayOffRequestSchema = Joi.object({
    newDayOff: Joi.string()
      .valid(
        weekDays.MONDAY,
        weekDays.SATURDAY,
        weekDays.SUNDAY,
        weekDays.TUESDAY,
        weekDays.WEDNESDAY,
        weekDays.THURSDAY
      )
      .required(),
    reason: Joi.string(),
  })
  const checkSchema = changeDayOffRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}
const validateAcceptDayOffRequest = (req, res, next) => {
  const acceptDayOffRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = acceptDayOffRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateRejectDayOffRequest = (req, res, next) => {
  const rejectDayOffRequestSchema = Joi.object({
    requestId: Joi.string().required(),
    comment: Joi.string(),
  })
  const checkSchema = rejectDayOffRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateSickLeavesRequest = (req, res, next) => {
  const sickLeavesRequestSchema = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
    comment: Joi.string(),
    document: Joi.array().items(Joi.string()).required(),
  })
  const checkSchema = sickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateMaternityLeavesRequest = (req, res, next) => {
  const sickLeavesRequestSchema = Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
    comment: Joi.string(),
    document: Joi.array().items(Joi.string()).required(),
  })
  const checkSchema = sickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}
const validateAcceptSickLeavesRequest = (req, res, next) => {
  const acceptSickLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = acceptSickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateRejectSickLeavesRequest = (req, res, next) => {
  const rejectSickLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
    comment: Joi.string(),
  })
  const checkSchema = rejectSickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}
const validateAcceptMaternityLeavesRequest = (req, res, next) => {
  const acceptSickLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = acceptSickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateRejectMaternityLeavesRequest = (req, res, next) => {
  const rejectSickLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
    comment: Joi.string(),
  })
  const checkSchema = rejectSickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateCancelSickLeavesRequest = (req, res, next) => {
  const cancelSickLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = cancelSickLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateCancelMaternityLeavesRequest = (req, res, next) => {
  const cancelMaternityLeavesRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = cancelMaternityLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateCancelChangeDayOffRequest = (req, res, next) => {
  const cancelChangeDayOffRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = cancelChangeDayOffRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}
const validateReplcamentRequest = (req, res, next) => {
  const replacementSchema = Joi.object({
    replacementMemberId: Joi.string().length(24).required(),
    slotId: Joi.string().length(24).required(),
    reason: Joi.string(),
    dateOfReplacement: Joi.date().required(),
  })
  const checkSchema = replacementSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

<<<<<<< HEAD
const validateSendAnnualLeaveRequest = (req, res, next) => {
  const annualLeaveSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.date().required(),
    replacementId: Joi.string().length(24),
    reason: Joi.string(),
  })

  const checkSchema = annualLeaveSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateAcceptRejectAnnualLeaveRequest = (req, res, next) => {
  const acceptRejectAnnualLeaveSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
    comment: Joi.string(),
  })

  const checkSchema = acceptRejectAnnualLeaveSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateCancelAnnualLeaveRequest = (req, res, next) => {
  const acceptRejectAnnualLeaveSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
  })

  const checkSchema = acceptRejectAnnualLeaveSchema.validate(req.body)
=======

const validateAccidentalLeave = (req, res, next) => {
  const validateAccidentalLeaveSchema = Joi.object({
    absentDate:Joi.date().required(),
    reason: Joi.string(),
  })
  const checkSchema = validateAccidentalLeaveSchema.validate(req.body)
>>>>>>> 84d4a5b18941d2d683aa308fa0233de9d9df9d6f
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

module.exports = {
  validateChangeDayOffRequest,
  validateAcceptDayOffRequest,
  validateRejectDayOffRequest,
  validateSickLeavesRequest,
  validateAcceptSickLeavesRequest,
  validateRejectSickLeavesRequest,
  validateMaternityLeavesRequest,
  validateAcceptMaternityLeavesRequest,
  validateRejectMaternityLeavesRequest,
  validateCancelSickLeavesRequest,
  validateCancelMaternityLeavesRequest,
  validateCancelChangeDayOffRequest,
  validateSlotLinkingRequest,
  validateAcceptRejectLinkingRequest,
  validateReplcamentRequest,
  validateViewSlotLinkingRequest,
<<<<<<< HEAD
  validateSendAnnualLeaveRequest,
  validateAcceptRejectAnnualLeaveRequest,
  validateCancelAnnualLeaveRequest,
=======
  validateAccidentalLeave,
>>>>>>> 84d4a5b18941d2d683aa308fa0233de9d9df9d6f
}
