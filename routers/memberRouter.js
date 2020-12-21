const express = require('express')
const router = express.Router()

const {
  validateAddMember,
  validateUpdateMember,
  validateLogin,
  validateActivateAccount,
  validateViewMember,
  validateResetPassword,
} = require('../validations/memberValidation')
const {
  addMember,
  login,
  activateAccount,
  updateMember,
  viewMember,
  resetPassword,
} = require('../controllers/memberController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/login', validateLogin, login)
router.post('/addMember', validateAddMember, addMember)
router.put('/updateMember', validateUpdateMember, verifyToken, updateMember)
router.post('/viewMember', validateViewMember, verifyToken, viewMember)
router.post('/resetPassword', validateResetPassword, verifyToken, resetPassword)
router.post('/activateAccount', validateActivateAccount, activateAccount)

module.exports = router
