const express = require('express')
const router = express.Router()

const { validateAddMember } = require('../validations/memberValidation')
const {addMember} = require('../controllers/memberController')

router.post('/addMember', validateAddMember, addMember)

module.exports = router