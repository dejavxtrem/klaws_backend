const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



const userSchema =  mongoose.Schema({
    name: {type: String},
    avatar: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamp: true})



//pre save functions to encrypt password

// presave function to check if the user has not modified his password
userSchema.pre('save', function(next) {
    const user = this
    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
            
        })
    })
})

userSchema.methods.comparePassword = function (userPassword) {
    const user = this
    return new Promise((resolve, reject) => {
            bcrypt.compare(userPassword, user.password, (err, isMatch) => {
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

userSchema.methods.withoutPassword = function () {
    const user = this.toObject()
    delete user.password
    return user;
}

module.exports = mongoose.model('User', userSchema)