const Joi = require('joi')
const { memberRoles, gender, weekDays } = require('../constants/constants')

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
    office: Joi.string().length(24).required(), //To be adjusted to real objectId
    salary: Joi.number().required(),
    department: Joi.string().length(24).required(),
    dayoff: Joi.string()
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
      .valid(
        memberRoles.INSTRUCTOR,
        memberRoles.TA,
        memberRoles.HOD,
        memberRoles.HR
      )
      .required(),
    birthdate: Joi.date(),
    gender: Joi.string().valid(gender.MALE, gender.FEMALE).required(),
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

const validateResetPassword = (req, res, next) => {
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
    type: Joi.string().valid(
      memberRoles.INSTRUCTOR,
      memberRoles.TA,
      memberRoles.HOD,
      memberRoles.HR
    ),
    birthdate: Joi.date(),
    gender: Joi.string().valid(gender.MALE, gender.FEMALE),
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

// const validateResetPassword = (req, res, next) => {
//   const validateResetPasswordSchema = Joi.object({
//     memberId: Joi.string().required(),
//     oldPassword: Joi.string().required(),
//     newPassword: Joi.string().required(),
//   })
//   const checkSchema = validateResetPasswordSchema.validate(req.body)
//   if (checkSchema.error) {
//     return res.status(400).json({
//       code: validationError,
//       message: checkSchema.error.details[0],
//     })
//   }
//   next()
// }

const validateSignInOut = (req, res, next) => {
  const signSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
  })
  const checkSchema = signSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateMissingSign = (req, res, next) => {
  const signSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    type: Joi.string().valid('signin', 'signout').required(),
  })
  const checkSchema = signSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateDeleteMember = (req, res, next) => {
  const deleteMemberSchema = Joi.object({
    memberId: Joi.string().length(24).required(),
  })
  const checkSchema = deleteMemberSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateAssignTaToCourse = (req, res, next) => {
  const assignMemberCourseSchema = Joi.object({
    member: Joi.string().length(24).required(),
    course: Joi.string().length(24).required(),
    // role: Joi.string().valid(memberRoles.TA, memberRoles.INSTRUCTOR).required(),
  })
  const checkSchema = assignMemberCourseSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateUpdateAssignTaToCourse = (req, res, next) => {
  const assignMemberCourseSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
    newMemberId: Joi.string().length(24).required(),
  })
  const checkSchema = assignMemberCourseSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateRemoveTaFromCourse = (req, res, next) => {
  const assignMemberCourseSchema = Joi.object({
    assignmentId: Joi.string().length(24).required(),
  })
  const checkSchema = assignMemberCourseSchema.validate(req.body)
  if (checkSchema.error) {
    return res.status(400).json({
      code: validationError,
      message: checkSchema.error.details[0],
    })
  }
  next()
}

const validateAssignCoordinator = (req, res, next) => {
  const assignCoordinatorSchema = Joi.object({
    member: Joi.string().length(24).required(),
    course: Joi.string().length(24).required(),
  })
  const checkSchema = assignCoordinatorSchema.validate(req.body)
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
  validateUpdateMember,
  validateViewMember,
  validateResetPassword,
  validateSignInOut,
  validateMissingSign,
  validateDeleteMember,
  validateAssignTaToCourse,
  validateAssignCoordinator,
  validateUpdateAssignTaToCourse,
  validateRemoveTaFromCourse,
}
