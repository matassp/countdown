const express = require('express')
const AuthenticationController = require('../controllers/AuthenticationController')
const router = express.Router()

router.post('/subscribe', AuthenticationController.subscribe)
module.exports = router