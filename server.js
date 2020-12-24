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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/members', memberRoutes)
app.use('/request', requestRoutes)
app.use('/faculties', facultyRoutes)
app.use('/departments', departmentRoutes)
app.use('/course', courseRoutes)
app.use('/attendance', attendanceRoutes)
app.use('/slotAssignment', slotAssignmentRoutes)

//useTimeout to delete expired tokens
setInterval(async () => {
  console.log('Will Check DB')
  await tokenBlacklistModel.deleteMany({
    date: { $lt: new Date() },
  })
}, 48 * 60 * 60 * 1000) //every 48 hours

app.listen(5000, () => {
  console.log('Server is up and running on port 5000')
})
