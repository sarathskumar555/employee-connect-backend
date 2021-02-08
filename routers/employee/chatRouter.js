const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const authHelper = require("../../helper/authhelper");
var chatcontroller = require('../../controller/employee/chatController.js');
const authhelper = require('../../helper/authhelper');
require('dotenv').config();



// router.get('/', authHelper.validate_token, usercontroller.get)
router.get('/',authHelper.validate_token, chatcontroller.getDetails)

router.post('/', chatcontroller.postDetails)

module.exports = router;