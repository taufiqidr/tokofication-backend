const Status = require('../models/Status')
const User = require('../models/User')

// @desc Get all statuses 
// @route GET /statuses
// @access Private
const getAllStatuses = async (req, res) => {
    // Get all statuses from MongoDB
    const statuses = await Status.find().lean()

    // If no statuses 
    if (!statuses?.length) {
        return res.status(400).json({ message: 'No status found' })
    }

    // Add username to each status before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const statusesWithUser = await Promise.all(statuses.map(async (status) => {
        const user = await User.findById(status.user).lean().exec()
        return { ...status, username: user.username }
    }))

    res.json(statusesWithUser)
}

// @desc Create new status
// @route POST /statuses
// @access Private
const createNewStatus = async (req, res) => {
    const { user, text } = req.body

    // Confirm data
    if (!user || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new user 
    const status = await Status.create({ user, text })

    if (status) { // Created 
        return res.status(201).json({ message: 'New status created' })
    } else {
        return res.status(400).json({ message: 'Invalid status data received' })
    }

}

// @desc Update a status
// @route PATCH /statuses
// @access Private
const updateStatus = async (req, res) => {
    const { id, user, text } = req.body

    // Confirm data
    if (!id || !user || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm status exists to update
    const status = await Status.findById(id).exec()

    if (!status) {
        return res.status(400).json({ message: 'Status not found' })
    }

    status.user = user
    status.text = text

    const updatedStatus = await status.save()

    res.json(`Status with id: '${updatedStatus.id}' updated`)
}

// @desc Delete a status
// @route DELETE /statuses
// @access Private
const deleteStatus = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Status ID required' })
    }

    // Confirm status exists to delete 
    const status = await Status.findById(id).exec()

    if (!status) {
        return res.status(400).json({ message: 'Status not found' })
    }

    const result = await status.deleteOne()

    const reply = `Status '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

// @desc Upvote a status
// @route PATCH /statuses
// @access Private
const upvoteStatus = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm status exists to update
    const status = await Status.findById(id).exec()

    if (!status) {
        return res.status(400).json({ message: 'Status not found' })
    }

    status.likes = status.likes + 1

    const updatedStatus = await status.save()

    res.json(`Success upvoted a status with id: '${updatedStatus.id}', current likes: ${updatedStatus.likes} `)
}
// @desc Downvote a status
// @route PATCH /statuses
// @access Private
const downvoteStatus = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm status exists to update
    const status = await Status.findById(id).exec()

    if (!status) {
        return res.status(400).json({ message: 'Status not found' })
    }

    status.likes = status.likes - 1

    const updatedStatus = await status.save()

    res.json(`Success downvoted a status with id: '${updatedStatus.id}', current likes: ${updatedStatus.likes} `)
}

module.exports = {
    getAllStatuses,
    createNewStatus,
    updateStatus,
    upvoteStatus,
    downvoteStatus,
    deleteStatus
}