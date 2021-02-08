const express = require('express');
const router = express.Router();

const mailhelper = require('../../helper/mailhelper.js')
const validatehelper = require('../../helper/validatehelper.js')

var authController = require('../../controller/admin/authController.js')
require('dotenv').config();



router.post('/login', authController.login)


module.exports = router;