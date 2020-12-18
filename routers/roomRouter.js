const express = require('express')
const router = express.Router()
const {validateRoom}=require("../validations/roomValidation")
const {addRoom}=require("../controllers/roomController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/addRoom',validateRoom,addRoom)
//router.post('/addRoom',verifyToken,verifyHR,validateRoom,addRoom)

module.exports=router