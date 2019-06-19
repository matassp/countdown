const express = require('express')
const AuthenticationController = require('../controllers/AuthenticationController')
const router = express.Router()

router.get('/list/:id', AuthenticationController.getList)
module.exports = router