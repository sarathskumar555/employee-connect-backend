var mysql = require("mysql");
let config = require("../../server/config.js");
let con = mysql.createConnection(config);
const adminModel = require("../../models/adminModel.js");
const mailhelper = require("../../helper/mailhelper.js");
const passwordHashHelper = require("../../helper/passwordHashHelper.js");

const {
    BadRequest,
    Forbidden,
    ServerError,
} = require("../../helper/errorhelper");
const { body } = require("express-validator");
const { resolveContent } = require("nodemailer/lib/shared");

var get = async (req, res, next) => {
    try {
        const result = await adminModel.getadminModel({});
        console.log(result);
        req.response.data = result;
        req.response.message = "getting the full users details";

        res.json(req.response);
    } catch (err) {
        next(err);
    }
};
var create = async (req, res, next) => {
    try {
        const { name, email, mobile_number, password } = req.body;
        const pass = await passwordHashHelper.generatePasswordHash(password);
        const [username] = await adminModel.loginname({ name });
        if (username) {
            req.response.message = "username already exists";
            res.json(req.response);
        }
        const result = await adminModel.insertadminModel({
            name,
            email,
            mobile_number,
            password: pass,
        });
        await mailhelper.mail({ email, password });
        res.setHeader("authorization", true);
        res.setHeader("x-access-token", "");
        res.setHeader("refresh-token", "");
        req.response.data = {
            email: email,
            name: name,
            mobile_number: mobile_number,
            password: password,
        };
        req.response.message = "Registration successful";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};

var deleted = async (req, res, next) => {
    try {
        const { emp_uid } = req.params;
        const result = await adminModel.deleteadminModel({ emp_uid });
        if (!result) throw new Forbidden("Sorry! we cannot process this request.");

        req.response.data = result;
        req.response.message = "deleted the user details using the uid";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};
var getid = async (req, res, next) => {
    try {
        const { emp_uid } = req.params;
        const [result] = await adminModel.getadminModel({ emp_uid });
        console.log(result);
        if (!result) throw new Forbidden("Sorry! we cannot process this request.");
        req.response.data = result;
        req.response.message = "getting the user details using uid";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};

var update = async (req, res, next) => {
    try {
        const { name, email, mobile_number, password } = req.body;
        const { emp_uid } = req.params;
        const result = await adminModel.updateadminModel(
            { emp_uid },
            { name, email, mobile_number, password }
        );
        req.response.data = {
            email: email,
            name: name,
            mobile_number: mobile_number,
            password: password,
        };
        req.response.message = "updated the user details";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    get: get,
    update: update,
    deleted: deleted,
    create: create,
    getid: getid,
};
