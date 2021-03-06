const express = require('express')
const AuthenticationController = require('../controllers/AuthenticationController')
const router = express.Router()

router.post('/register', AuthenticationController.register)

module.exports = router