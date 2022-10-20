const User = require('../models/User')
const Status = require('../models/Status')

// @desc Get all users
// @route GET /users/:username
// @access Public
const getUserByUsername = async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username }).select('-_id -password -roles -email -__v').exec()
    if (!user) {
        return res.status(400).json({ message: 'No user found' })
    }
    res.json(user)
}

const getUserStatuses = async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username }).select('_id').lean().exec()
    if (!user) {
        return res.status(400).json({ message: 'user not found' })
    }
    const statuses = await Status.find({ user }).lean()
    if (!statuses?.length) {
        return res.status(400).json({ message: 'No status found' })
    }
    res.json(statuses)
}

module.exports = {
    getUserByUsername,
    getUserStatuses
}