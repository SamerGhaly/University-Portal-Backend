const express = require('express')
const router = express.Router()
const {
  validateRoom,
  validateRoomU,
  validateRoomD,
} = require('../validations/roomValidation')
const {
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/addRoom', validateRoom, verifyToken, verifyHR, addRoom)
router.put('/updateRoom', validateRoomU, verifyToken, verifyHR, updateRoom)
router.delete('/deleteRoom', validateRoomD, verifyToken, verifyHR, deleteRoom)

module.exports = router
