const mongoose = require('mongoose')
const { model } = require('./NailTech')

const serviceSchema = new mongoose.Schema({
        serviceType: {type: String, required: true},
        serviceName: {type: String, required: true},
        address: {type: String, required: true},
        servicePrice: {type: String, required: true},
        serviceTime: {type: String, required: true},
        servicePhoto: [String],
        artistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'nailArtist'
    }
})

module.exports = mongoose.model('nailservice', serviceSchema)