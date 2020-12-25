require('dotenv').config()
const connectDB = require('./configurations/DBconfig')

const TokenBlacklist = require('./models/tokenBlacklistModel')

const express = require('express')
const app = express()
const memberRoutes = require('./routers/memberRouter')
const facultyRoutes = require('./routers/facultyRouter')
const departmentRoutes = require('../milestone-1-team-64/routers/departmentRouter')
const roomRoutes = require('./routers/roomRouter')
const courseRoutes = require('./routers/courseRouter')
const attendanceRoutes = require('./routers/attendanceRecordRouter')
const slotAssignmentRoutes = require('./routers/slotAssignmentRouter')
const requestRoutes = require('./routers/requestRouter')
const tokenBlacklistModel = require('./models/tokenBlacklistModel')
const MemberModel = require('./models/memberModel')
const bcrypt = require('bcryptjs')
const RoomModel = require('./models/roomModel')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/member', memberRoutes)
app.use('/request', requestRoutes)
app.use('/faculty', facultyRoutes)
app.use('/department', departmentRoutes)
app.use('/course', courseRoutes)
app.use('/attendance', attendanceRoutes)
app.use('/slotAssignment', slotAssignmentRoutes)
app.use('/room', roomRoutes)

//useTimeout to delete expired tokens
setInterval(async () => {
  console.log('Will Check DB')
  await tokenBlacklistModel.deleteMany({
    date: { $lt: new Date() },
  })
}, 48 * 60 * 60 * 1000) //every 48 hours

app.listen(5000, async () => {
  console.log('Server is up and running on port 5000')

  const checkMemberInserted = await MemberModel.findOne({
    email: 'admin@guc.com',
  })
  if (!checkMemberInserted) {
    const hrRoom = await RoomModel.create({
      type: 'office',
      capacity: 10,
      name: 'C6-123',
    })

    await MemberModel.create({
      name: 'admin',
      email: 'admin@guc.com',
      password: bcrypt.hashSync('admin'),
      type: 'hr',
      salary: 5000,
      gender: 'male',
      dateCreated: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      annualBalanceTaken: 0,
      accidentalDaysTake: 0,
      customId: 'hr-1',
      office: hrRoom._id,
      dayoff: 'saturday',
      activated: true,
    })
  }
})
