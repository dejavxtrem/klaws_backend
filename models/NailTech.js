const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALD_ROUNDS = 6;

const NailTechs = mongoose.Schema({
    shopName: {type: String, required: true},
    address: {type: String, required:true},
    city: {type:String, required:true},


})