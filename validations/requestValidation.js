const Joi = require('joi')
const { validationError } = require('../constants/errorCodes')
const { weekDays, requestType } = require('../constants/constants')

const validateSlotLinkingRequest = (req, res, next) => {
  const slotLinkingSchema = Joi.object({
    slotId: Joi.string().length(24).required(),
  })
  const checkSchema = slotLinkingSchema.validate(req.body)
  if (checkSchema.error)
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0].message,
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
      code: validationError,
      message: checkSchema.error.details[0].message,
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
      code: validationError,
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}
const validateAcceptAccidentalLeave = (req, res, next) => {
  const acceptDayOffRequestSchema = Joi.object({
    requestId: Joi.string().required(),
  })
  const checkSchema = acceptDayOffRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateCancelMaternityLeavesRequest = (req, res, next) => {
  const cancelMaternityLeavesRequestSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
  })
  const checkSchema = cancelMaternityLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateAccidentalLeave = (req, res, next) => {
  const validateAccidentalLeaveSchema = Joi.object({
    absentDate: Joi.date().required(),
    reason: Joi.string(),
  })
  const checkSchema = validateAccidentalLeaveSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

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
      message: checkSchema.error.details[0].message,
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
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateCancelAnnualLeaveRequest = (req, res, next) => {
  const acceptRejectAnnualLeaveSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
  })

  const checkSchema = acceptRejectAnnualLeaveSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

// const validateAccidentalLeave = (req, res, next) => {
//   const validateAccidentalLeaveSchema = Joi.object({
//     absentDate: Joi.date().required(),
//     reason: Joi.string(),
//   })
//   const checkSchema = validateAccidentalLeaveSchema.validate(req.body)
//   if (checkSchema.error) {
//     return res.json({
//       code: validationError,
//       message: checkSchema.error.details[0].message,
//     })
//   }
//   next()
// }

const validateCompensationLeavesRequest = (req, res, next) => {
  const compensationLeavesRequestSchema = Joi.object({
    absentDate: Joi.string().required(),
    compensationDate: Joi.string().required(),
    comment: Joi.string(),
    reason: Joi.string().required(),
  })

  const checkSchema = compensationLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}
const validateAcceptCompensationLeavesRequest = (req, res, next) => {
  const accpetCompensationLeavesRequestSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
  })
  const checkSchema = accpetCompensationLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateRejectCompensationLeavesRequest = (req, res, next) => {
  const rejectCompensationLeavesRequestSchema = Joi.object({
    requestId: Joi.string().length(24).required(),
    comment: Joi.string(),
  })
  const checkSchema = rejectCompensationLeavesRequestSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
    })
  }
  next()
}

const validateViewRequest = (req, res, next) => {
  const viewSchema = Joi.object({
    status: Joi.string().valid(
      requestType.PENDING,
      requestType.ACCEPT,
      requestType.REJECT,
      requestType.CANCELLED
    ),
  })
  const checkSchema = viewSchema.validate(req.body)
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0].message,
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
  validateAcceptAccidentalLeave,
  validateAccidentalLeave,
  validateSendAnnualLeaveRequest,
  validateAcceptRejectAnnualLeaveRequest,
  validateCancelAnnualLeaveRequest,
  validateCompensationLeavesRequest,
  validateAcceptCompensationLeavesRequest,
  validateRejectCompensationLeavesRequest,
  validateViewRequest,
}
