const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const lashTechSchema =  mongoose.Schema({
    avatar: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    salonname: {type: String, required:true},
    password: {type: String, required:true},
}, {timestamp: true})



lashTechSchema.pre('save', function(next) {
    const lashTech = this
    if (!lashTech.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(lashTech.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            lashTech.password = hash;
            next()
            
        })
    })
})

lashTechSchema.methods.comparePassword = function (lashTechPassword) {
    const lashTech = this
    return new Promise((resolve, reject) => {
            bcrypt.compare(lashTechPassword, lashTech.password, (err, isMatch) => {
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

lashTechSchema.methods.withoutPassword = function () {
    const lashTech = this.toObject()
    delete lashTech.password
    return lashTech;
}


module.exports = mongoose.model('lashArtist', lashTechSchema)