const connectDB = require('./configurations/DBconfig')

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

app.listen(5000, () => {
  console.log('Server is up and running on port 5000')
})
