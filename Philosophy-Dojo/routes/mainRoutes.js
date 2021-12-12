const express = require('express');
const mainController = require('../controllers/mainController');
const router = express.Router();

router.get('/', mainController.index);

router.get('/about', mainController.aboutPage);

router.get('/contact',mainController.contactPage);

module.exports = router;