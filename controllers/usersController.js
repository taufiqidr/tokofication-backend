const User = require('../models/User')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: ['username', 'balance', 'isMerchant', 'roles']
    });
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
    const { username, password, balance } = req.body

    if (!username || !password || !balance) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate_username = await User.findOne({ where: { username: username } })

    if (duplicate_username) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const UserObject = {
        username,
        "password": hashedPwd,
        balance
    }

    const user = await User.create(UserObject);
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
    const { id, username, password, balance } = req.body

    // Confirm data 
    if (!id) {
        return res.status(400).json({ message: 'ID field are required' })
    }
    // Does the user exist to update?
    const user = await User.findOne({ where: { id: id } })

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    let duplicate_username
    if (username) {
        duplicate_username = await User.findOne({ where: { username: username } })
    }

    // Allow updates to the original user 
    if (duplicate_username && duplicate_username?.id !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    if (username) user.username = username
    if (balance) user.balance = balance
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

    const user = await User.findOne({ where: { id: id } })

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    await user.destroy()

    res.json({ message: 'User deleted' })
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}