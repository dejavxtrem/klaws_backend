const mongoose = require('mongoose')
const { model } = require('./NailTech')

const serviceSchema = new mongoose.Schema({
        serviceType: {type: String},
        serviceName: {type: String},
        address: {type: String},
        servicePrice: {type: String},
        serviceTime: {type: String},
        servicePhoto: [String],
        artistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'nailArtist'
    }
})

module.exports = mongoose.model('nailservice', serviceSchema)