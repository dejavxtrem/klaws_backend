const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const hairTechSchema =  mongoose.Schema({
    avatar: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    salonname: {type: String, required:true},
    password: {type: String, required:true},
    artistLocation: {
        artistLat: {type: String},
        artistLong: {type: String},
        accuracy:{type: String}

    }
}, {timestamp: true})


hairTechSchema.pre('save', function(next) {
    const hairTech = this
    if (!hairTech.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(hairTech.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            hairTech.password = hash;
            next()
            
        })
    })
})

hairTechSchema.methods.comparePassword = function (hairTechPassword) {
    const hairTech = this
    return new Promise((resolve, reject) => {
            bcrypt.compare(hairTechPassword, hairTech.password, (err, isMatch) => {
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

hairTechSchema.methods.withoutPassword = function () {
    const hairTech = this.toObject()
    delete hairTech.password
    return hairTech;
}


module.exports = mongoose.model('hairArtist', hairTechSchema)