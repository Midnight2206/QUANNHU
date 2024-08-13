const express = require('express')
const router = express.Router()


const listQuantrangController = require('../controllers/listQuantrangController')
const individualController = require('../controllers/individualController')
const criterionController = require('../controllers/criterionController')
const dispensationController = require('../controllers/dispensationController')
const increaseController = require('../controllers/increaseController')
const decreaseController = require('../controllers/decreaseController')

router.get('/individual', individualController.render)
router.patch('/individual/:id', individualController.update) 
router.get('/criterion', criterionController.render)
router.get('/criterion/update', criterionController.renderUpdate)
router.post('/criterion', criterionController.create)
router.post('/increase', increaseController.increase)
router.post('/increase/filter', increaseController.filter)
router.get('/increase/list', increaseController.list)
router.get('/decrease', decreaseController.render)
router.get('/decrease/list', decreaseController.list)
router.post('/decrease/filter', decreaseController.filter)
router.post('/decrease', decreaseController.decrease)
router.get('/increase', increaseController.render)
router.put('/criterion', criterionController.update)
router.get('/dispensation', dispensationController.render)
router.post('/import', listQuantrangController.import)
router.patch('/add', listQuantrangController.add)

router.get('/search', listQuantrangController.search )
router.get('/', listQuantrangController.render);


module.exports = router