const express = require('express')
const router = express.Router()
const statusesController = require('../controllers/statusesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(statusesController.getAllStatuses)
    .post(statusesController.createNewStatus)
    .patch(statusesController.updateStatus)
    .delete(statusesController.deleteStatus)

router.route('/upvote').patch(statusesController.upvoteStatus)
router.route('/downvote').patch(statusesController.downvoteStatus)

module.exports = router