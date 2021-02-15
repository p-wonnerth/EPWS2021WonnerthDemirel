const mongoose = require('mongoose')

const kassenbonSchema = new mongoose.Schema({
    produkte: {
        type: Array,
        required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    }
    /*ausgaben: {
        type: Float32Array,
        required: true
    }*/

})

module.exports = mongoose.model('Kassenbon', kassenbonSchema)
