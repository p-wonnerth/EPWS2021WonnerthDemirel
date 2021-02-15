const mongoose = require('mongoose')
var moment = require('moment')

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    kassenbons: [
      {
        products: [],
        createdAt: {
          type: String,
          required: true
        }
      }

    ],



})

module.exports = mongoose.model('User', userSchema)
