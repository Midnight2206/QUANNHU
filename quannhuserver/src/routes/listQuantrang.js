const express = require('express')
const router = express.Router()


const listQuantrangController = require('../controllers/listQuantrangController')
const individualController = require('../controllers/individualController')
const criterionController = require('../controllers/criterionController')
const dispensationController = require('../controllers/dispensationController')

router.get('/individual', individualController.render)
router.patch('/individual/:id', async (req, res) => {
  try {
    const id = req.params.id
    const year = req.query.year
    const data = req.body
    individualController.update(req, res, id, year, data)
  } catch (error) {
    res.json(error)
  }
})
router.get('/criterion', criterionController.render)
router.post('/criterion', criterionController.create)
router.put('/criterion', criterionController.update)
router.get('/dispensation', dispensationController.render)
router.post('/add', listQuantrangController.add)
router.get('/search', async (req, res) => {
  try {
    const year = req.query.year;
    const searchQuery = req.query.q

    // Thực hiện xử lý yêu cầu với tham số year
    const data = await listQuantrangController.search(req, res, searchQuery, year);

    // Trả về kết quả cho client
    res.json(data);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
router.get('/', listQuantrangController.render);


module.exports = router