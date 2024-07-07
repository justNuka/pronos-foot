const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');

router.get('/:id', authController.authenticateJWT, profileController.getProfile);

module.exports = router;