const User = require('../models/User')
const Status = require('../models/Status')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
}

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { name, username, description, email, password, roles } = req.body
    const dob = new Date(req.body.dob)
    // Confirm data
    if (!username || !email || !password || dob === "Invalid Date") {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate_username = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate_username) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Check for duplicate email
    const duplicate_email = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate_email) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { name, username, description, email, dob, "password": hashedPwd }
        : { name, username, description, email, dob, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
}

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const { id, name, username, description, email, password, dob } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID field are required' })
    }
    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    let duplicate_username, duplicate_email
    if (username) {
        duplicate_username = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()
    }
    if (email) {
        duplicate_email = await User.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
    }

    // Allow updates to the original user 
    if (duplicate_username && duplicate_username?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    if (duplicate_email && duplicate_email?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    if (name) user.name = name
    if (username) user.username = username
    if (description) user.description = description
    if (email) user.email = email
    if (dob) user.dob = new Date(req.body.dob)
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
}

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned statuses?
    const status = await Status.findOne({ user: id }).lean().exec()
    if (status) {
        return res.status(400).json({ message: 'User still has statuses left' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

