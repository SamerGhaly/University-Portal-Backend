require('dotenv').config()
const connectDB = require('./configurations/DBconfig')

const express = require('express')
const app = express()
const memberRoutes = require('./routers/memberRouter')
const facultyRoutes = require('./routers/facultyRouter')
const departmentRoutes = require('./routers/departmentRouter')
const roomRoutes = require('./routers/roomRouter')
const scheduleModel = require('./models/scheduleModel')
const scheduleRouter = require('./routers/scheduleRouter')
const requestRouter = require('./routers/requestRouter')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/members', memberRoutes)

app.use('/faculties', facultyRoutes)

app.use('/departments', departmentRoutes)

//app.use('/schedules', scheduleRouter)

app.use('/members', memberRoutes)

app.use('/room', roomRoutes)

app.use('/request', requestRouter)

app.listen(5000, () => {
  console.log('Server is up and running on port 5000')
})
