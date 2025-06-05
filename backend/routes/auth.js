const router = require('express').Router()
const authController = require('../controllers/authController')

// register
router.post('/register', authController.registerController)
// login
router.post('/login', authController.loginController)

module.exports = router
