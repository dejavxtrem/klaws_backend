const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    serviceType: {type: String, required: true},
    service: {
        serviceName: {type: String, required: true},
        address: {type: String, required: true},
        servicePrice: {type: String, required: true},
        serviceTime: {type: String, required: true},
        servicePhoto: [String]
    }
})