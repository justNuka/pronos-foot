const express = require('express');
const router = express.Router();
const { getPredictions, addPrediction } = require('../controllers/predictionsController');

router.get('/', getPredictions);
router.post('/', addPrediction);

module.exports = router;