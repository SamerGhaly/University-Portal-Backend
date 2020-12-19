const express = require('express')
const router = express.Router()

const {
  validateAddMember,
  validateUpdateMember,
  validateLogin,
  validateViewMember,
  validateResetPassword,
  validateSignInOut,
  validateMissingSign,
} = require('../validations/memberValidation')
const {
  addMember,
  login,
  resetPassword,
  updateMember,
  viewMember,
  signIn,
  signOut,
  addMissingSign,
} = require('../controllers/memberController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/login', validateLogin, login)
router.post('/signIn', validateSignInOut, signIn)
router.post('/signOut', validateSignInOut, signOut)
router.post(
  '/addMissingSign',
  validateMissingSign,
  verifyToken,
  verifyHR,
  addMissingSign
)
router.post('/addMember', validateAddMember, verifyToken, verifyHR, addMember)
router.put('/updateMember', validateUpdateMember, verifyToken, updateMember)
router.post('/viewMember', validateViewMember, verifyToken, viewMember)
router.post('/resetPassword', validateResetPassword, resetPassword)

module.exports = router
