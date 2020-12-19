const connectDB = require('./configurations/DBconfig')

const express = require('express')
const app = express()
const memberRoutes = require('./routers/memberRouter')
const roomRoutes = require('./routers/roomRouter')
const courseRoutes=require('./routers/courseRouter')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.use('/members', memberRoutes)
app.use('/room',roomRoutes)
app.use('/course',courseRoutes)

app.listen(5000, () => {
  console.log('Server is up and running on port 5000')
})
