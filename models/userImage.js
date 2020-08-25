const mongoose = require('mongoose')
const User = require('./User.js')

const userImage = new Schema({
    userprofile_avatar: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        userimage: {type: String}
    }
})


module.exports = mongoose.model('useravatar', userImage)