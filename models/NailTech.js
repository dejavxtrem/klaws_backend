const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const serviceSchema = new mongoose.Schema({
    serviceType: {type: String, required: true},
    service: {
        serviceName: {type: String, required: true},
        address: {type: String, required: true},
        servicePrice: {type: String, required: true},
        serviceTime: {type: String, required: true},
        servicePhoto: {type: String, required: true}
    }
})


const NailTech = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    salonname: {type: String, required:true},
    password: {type: String, required:true},
    serviceType: [serviceSchema]
}, {timestamp: true})


