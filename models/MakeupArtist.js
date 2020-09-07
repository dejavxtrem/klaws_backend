const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const makeUpArtist =  mongoose.Schema({
    avatar: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required:true},
    artistAvater: {type: String},
    salonname: {type: String, required:true},
    address: {type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zipcode: {type: String, required: true},
    openinghour: {type: String, required: true},
    closinghour: {type: String, requied: true},
    artistLocation: {
        artistLat: {type: String},
        artistLong: {type: String},
        accuracy:{type: String}
    }
}, 
{timestamp: true})


makeUpArtist.pre('save', function(next) {
    const makeUpTech = this
    if (!makeUpTech.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(makeUpTech.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            makeUpTech.password = hash;
            next()
            
        })
    })
})

makeUpArtist.methods.comparePassword = function (makeUpTechPassword) {
    const makeUpTech = this
    return new Promise((resolve, reject) => {
            bcrypt.compare(makeUpTechPassword, makeUpTech.password, (err, isMatch) => {
                    if (err) {
                        return reject(err)
                    }
                    if (!isMatch) {
                        return  reject(false)
                    }
                    resolve(true)
            })
    })
}

makeUpArtist.methods.withoutPassword = function () {
    const makeUpTech = this.toObject()
    delete makeUpTech.password
    return makeUpTech;
}


module.exports = mongoose.model('makeUpArtist', makeUpArtist)