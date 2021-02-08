const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const mailhelper = require('../../helper/mailhelper.js')
const validatehelper = require('../../helper/validatehelper.js')

let config = require('../../server/config.js');
const { check, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
var adminController = require('../../controller/admin/adminController.js')
require('dotenv').config();



router.get('/', adminController.get)
router.delete('/:emp_uid', adminController.deleted)
router.get('/:emp_uid', adminController.getid)
router.post('/', adminController.create)
router.patch('/:emp_uid', adminController.update)

module.exports = router;