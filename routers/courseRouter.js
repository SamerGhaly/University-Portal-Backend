const express = require('express')
const router = express.Router()

const {validateCourse}=require("../validations/courseValidation")
const {addCourse}=require("../controllers/courseController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

// router.post('addCourse',verifyToken,verifyHR,validateCourse,addCourse)
router.post('addCourse',validateCourse,addCourse)
module.exports=router