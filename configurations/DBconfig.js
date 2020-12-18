require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Database connected successfully')
    })
    .catch((err) => {
      console.log('Failed to connect')
    })
}

module.exports = connectDB
