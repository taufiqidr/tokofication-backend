const express = require('express')
const router = express.Router()
const publicController = require('../controllers/publicController')

router.route('/user/:username')
    .get(publicController.getUserByUsername)
router.route('/status/:username')
    .get(publicController.getUserStatuses)

module.exports = router