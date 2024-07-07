const express = require('express');
const router = express.Router();
const { getAdminPage } = require('../controllers/adminController');

router.get('/', getAdminPage);

module.exports = router;