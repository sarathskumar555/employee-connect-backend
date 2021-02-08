const passwordHashHelper = require("../../helper/passwordHashHelper.js");
const adminModel = require("../../models/adminModel.js");
const { UnauthorizedRequest } = require("../../helper/errorHelper.js");

// const usermodel = require('../../models/adminModel.js');

var login = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const [result] = await adminModel.loginname({ name });
        if (!result)
            throw new UnauthorizedRequest("incorrect password and username");
        const pass = await passwordHashHelper.comparePasswordHash(
            password,
            result.password
        );
        if (!pass) throw new UnauthorizedRequest("incorrect passwor dor username");
        req.response.message = "login successfully";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login: login,
};
