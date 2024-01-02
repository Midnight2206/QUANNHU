const express = require('express')
const router = express.Router()

const HomeController = require('../controllers/homeController')
router.post('/signup', HomeController.signup)
router.get('/', HomeController.show)

module.exports = router