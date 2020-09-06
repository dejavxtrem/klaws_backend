const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const nailTechSchema =  mongoose.Schema({
    avatar: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    salonname: {type: String, required:true},
    password: {type: String, required:true},
    artistLocation: {
        artistLat: {type: String},
        artistLong: {type: String}
    }
}, {timestamp: true})


nailTechSchema.pre('save', function(next) {
    const nailTech = this
    if (!nailTech.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(nailTech.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            nailTech.password = hash;
            next()
            
        })
    })
})

nailTechSchema.methods.comparePassword = function (nailTechPassword) {
    const nailTech = this
    return new Promise((resolve, reject) => {
            bcrypt.compare(nailTechPassword, nailTech.password, (err, isMatch) => {
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

nailTechSchema.methods.withoutPassword = function () {
    const nailTech = this.toObject()
    delete nailTech.password
    return nailTech;
}


module.exports = mongoose.model('nailArtist', nailTechSchema)