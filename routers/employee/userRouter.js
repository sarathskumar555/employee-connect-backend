const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const mailhelper = require('../../helper/mailhelper.js')
const validatehelper = require('../../helper/validatehelper.js')
const authHelper = require("../../helper/authhelper");

let config = require('../../server/config.js');
const { check, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
var usercontroller = require('../../controller/employee/userController.js');
const authhelper = require('../../helper/authhelper');
require('dotenv').config();



router.get('/', authHelper.validate_token ,usercontroller.get)
router.delete('/:emp_uid', authHelper.validate_token,usercontroller.deleted)
router.get('/:emp_uid', authHelper.validate_token,usercontroller.getid)
router.post('/',  usercontroller.create)
router.patch('/:emp_uid',authHelper.validate_token,usercontroller.update)

module.exports = router;