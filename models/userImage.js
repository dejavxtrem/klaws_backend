const mongoose = require('mongoose')
//const User = require('./User.js')

const userImage = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        userImage: {type: String}
    
})


module.exports = mongoose.model('useravatar', userImage)