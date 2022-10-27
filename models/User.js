const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    description: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    dob: {
        type: Date,
        required: true
    },
    roles: {
        type: [String],
        default: ["Normal"]
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema)

// profile picture pakai url