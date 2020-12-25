const express = require('express')
const router = express.Router()

const { validateAddFaculty } = require('../validations/facultyValidation')
const { addFaculty } = require('../controllers/facultyController')
const { validateUpdateFaculty } = require('../validations/facultyValidation')
const { updateFaculty } = require('../controllers/facultyController')
const { validateDeleteFaculty } = require('../validations/facultyValidation')
const { deleteFaculty } = require('../controllers/facultyController')
const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post(
  '/addFaculty',
  validateAddFaculty,
  verifyToken,
  verifyHR,
  addFaculty
)
router.put(
  '/updateFaculty',
  validateUpdateFaculty,
  verifyToken,
  verifyHR,
  updateFaculty
)
router.delete(
  '/deleteFaculty',
  validateDeleteFaculty,
  verifyToken,
  verifyHR,
  deleteFaculty
)

module.exports = router
