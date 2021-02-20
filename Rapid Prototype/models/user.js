const mongoose = require('mongoose')
var moment = require('moment')

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    kassenbons: [
      {
        products: [],
        createdAt: {
          type: String,
          required: true
        },
        gesamtPreis: {
          type: Number,
          required: true,
          default: 0
        },
        spende: {
          type: String,
          required: true,
          default: 0
        }
      }

    ],
    spendenorganisation:
      {
        name: {
          type: String,
          required: true,
          default: "Deutsche Landwirtschaft"
        },
        website: {
          type: String,
          required: true,
          default: "https://www.bund.net/landwirtschaft/"
        }
      }



})

module.exports = mongoose.model('User', userSchema)
