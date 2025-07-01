const express = require('express');
const router = express.Router();
const controller = require('../controllers/dressMaster.controller');

router.post('/', controller.addDress);
router.get('/', controller.getDresses);
router.delete('/:id', controller.deleteDress);

router.post('/roll-press-master', controller.addRollOrPress);
router.get('/roll-press-master', controller.getRollOrPress);
router.delete('/roll-press-master/:id', controller.deleteRollOrPress);
router.post('/update-positions', controller.updateDressPositions);

module.exports = router;
