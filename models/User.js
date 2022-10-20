const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    profile_pic: {
        type: String,
        default: "default.jpg"
    },
    dob: Date,
    roles: {
        type: [String],
        default: ["Normal"]
    }
})

module.exports = mongoose.model('User', userSchema)