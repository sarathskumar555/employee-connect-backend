const express = require('express');
const router = express.Router();

const mailhelper = require('../../helper/mailhelper.js')
const validatehelper = require('../../helper/validatehelper.js')

var authController = require('../../controller/employee/authController.js')
const authHelper = require('../../helper/authhelper');




router.post('/login', authController.login)
router.post('/logout', authHelper.validate_token,authController.removeSession,authHelper.revokeToken)


module.exports = router;