const express = require('express')
const router = express.Router()
const warehouseController = require('../controllers/warehouseController')

router.post('/bill', warehouseController.saveBill)


module.exports = router