const mongoose = require('mongoose')

const kassenbonSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    produkte: {
        type: Array,
        required: true
    }
    /*ausgaben: {
        type: Float32Array,
        required: true
    }*/
    
})

module.exports = mongoose.model('Kassenbon', kassenbonSchema)