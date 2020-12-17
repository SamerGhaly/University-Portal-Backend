require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = () => {
  console.log("process.env.MONGODB_URI")
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected successfully')
    })
    .catch((err) => {
      console.log('Failed to connect')
    })
}

module.exports = connectDB
