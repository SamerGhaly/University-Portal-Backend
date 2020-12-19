const Room = require('../models/roomModel')
const { catchError, roomDoesnotExist } = require('../constants/errorCodes')

const addRoom = async (req, res) => {
  try {
    const office = new Room({
      name: req.body.name,
      type: req.body.type,
      capacity: req.body.capacity,
    })
    await office.save()
    return res.json({ message: 'Room added' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndRemove({ _id: req.body.roomId })
    if (!room)
      return res.status(404).json({
        message: 'room does not exist',
        code: roomDoesnotExist,
      })
    console.log(req.body.roomId)
    // const room=await Room.findById(req.body.roomId)
    console.log(room._id)
    if (req.body.name !== undefined) room.name = req.body.name
    if (req.body.type !== undefined) room.type = req.body.type
    if (req.body.capacity !== undefined) room.capacity = req.body.capacity
    console.log(typeof room)
    room._id = undefined
    console.log(room)
    await room.save()
    return res.json({ message: 'Room updated' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndRemove({ _id: req.body.roomId })
    if (!room)
      return res.status(404).json({
        message: 'room does not exist',
        code: roomDoesnotExist,
      })
    return res.json({ message: 'Room deleted' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
module.exports = { addRoom, updateRoom, deleteRoom }
