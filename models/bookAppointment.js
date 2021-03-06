const mongoose = require('mongoose')
const { model } = require('./addService')
//const { model } = require('./User')

const appointmentSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'nailservice'
    },
    slot_time: {type: String, required: true},
    slot_date: {type: String, required: true},
    created_at: {type: Date},
    created_ByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'nailArtist'
    },
    total: {type: String}
})


module.exports = mongoose.model('appointment', appointmentSchema)