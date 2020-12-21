require('dotenv').config()
const connectDB = require('./configurations/DBconfig')

const express = require('express')
const app = express()
const memberRoutes = require('./routers/memberRouter')
const facultyRoutes = require('./routers/facultyRouter')
const departmentRoutes = require('../milestone-1-team-64/routers/departmentRouter')
const roomRoutes = require('./routers/roomRouter')
const courseRoutes = require('./routers/courseRouter')
const attendanceRoutes = require('./routers/attendanceRecordRouter')
const slotAssignmentRoutes = require('./routers/slotAssignmentRouter')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/members', memberRoutes)
app.use('/room', roomRoutes)
app.use('/course', courseRoutes)
app.use('/faculties', facultyRoutes)
app.use('/departments', departmentRoutes)
app.use('/course', courseRoutes)
app.use('/room', roomRoutes)
app.use('/faculties', facultyRoutes)
app.use('/departments', departmentRoutes)
app.use('/attendance', attendanceRoutes)
app.use('/slotAssignment', slotAssignmentRoutes)

app.listen(5000, () => {
  console.log('Server is up and running on port 5000')
})
