const { unauthorized } = require('../constants/errorCodes')
const { memberRoles } = require('../constants/constants')

const verifyHR = (req, res, next) => {
  if (req.member.type !== memberRoles.HR) {
    return res.status(403).json({
      code: unauthorized,
      message: 'Unauthorized to perform HR actions',
    })
  }
  next()
}

const verifyHOD = (req, res, next) => {
  if (req.member.type !== memberRoles.HOD) {
    return res.status(403).json({
      code: unauthorized,
      message: 'Unauthorized to perform HOD actions',
    })
  }
  next()
}

const verifyInstructor = (req, res, next) => {
  if (req.member.type !== memberRoles.INSTRUCTOR) {
    return res.status(403).json({
      code: unauthorized,
      message: 'Unauthorized to perform Instructor actions',
    })
  }
  next()
}

module.exports = { verifyHR, verifyHOD, verifyInstructor }
