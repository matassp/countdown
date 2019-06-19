const express = require('express')
const AuthenticationController = require('../controllers/AuthenticationController')
const router = express.Router()

router.post('/unsubscribe', AuthenticationController.unsubscribe)
module.exports = router