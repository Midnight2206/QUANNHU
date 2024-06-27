const express = require('express')
const router = express.Router()


const sharedMilitaryEquipmentController = require('../controllers/sharedMilitaryEquipmentController')

router.post('/create', sharedMilitaryEquipmentController.create)
router.post('/create-part', sharedMilitaryEquipmentController.createPart)
router.get('/', sharedMilitaryEquipmentController.render)

module.exports = router