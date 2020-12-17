const express = require('express')
const router = express.Router()

const {
  validateAddMember,
  validateLogin,
  validateActivateAccount,
} = require('../validations/memberValidation')
const {
  addMember,
  login,
  activateAccount,
} = require('../controllers/memberController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/login', validateLogin, login)
router.post('/addMember', validateAddMember, verifyToken, verifyHR, addMember)
router.post('/activateAccount', validateActivateAccount, activateAccount)

module.exports = router
