var mysql = require('mysql');
let config = require('../../server/config.js');
let con = mysql.createConnection(config);
const usermodel = require('../../models/userModel.js');
const loginModel = require('../../models/loginModel.js');
const mailhelper = require('../../helper/mailhelper.js');
const authHelper = require('../../helper/authhelper.js');
const passwordHashHelper = require('../../helper/passwordHashHelper.js');
const { BadRequest, Forbidden, ServerError, UnauthorizedRequest } = require('../../helper/errorhelper');
const { body } = require('express-validator');
const io = require('../../helper/sockethelper')


var get = async (req, res, next) => {

    try {
        const result = await usermodel.getusermodel({})
       
        req.response.data = result;
        req.response.message = "getting the full users details"
        res.json(req.response)
    }
    catch (err) {
        next(err)
    }

}
var create = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, designation, profilePicture
        } = req.body
        const pass = await passwordHashHelper.generatePasswordHash(password)
        const [username] = await usermodel.findUserName({ firstName })
        if (username) throw new UnauthorizedRequest(" username already exists");
        const result = await usermodel.insertusermodel({ firstName, lastName, email, password: pass, designation, profilePicture })

        const [data] = await usermodel.findUserName({ firstName })
        io.getIO().emit('posts', { action: 'create', post: req.body })
        await mailhelper.mail({ email, password })
        const { uid: login_uid } = await loginModel.create({
            user_id:data.id,
            fcm_id:req.body.fcm_id
        }); 
        let tokenData = {
            user_uid:data.uid,
            login_uid,
        }
        const { token, refresh_token } = await authHelper.generate_token(tokenData, 1);
        res.setHeader("authorization", true);
        res.setHeader("x-access-token", token);
        res.setHeader("refresh-token", refresh_token);
        req.response.data = {
           
            firstName:firstName,
            lastName:lastName,
            email: email,
            password:password,
            designation:designation
        }
        req.response.message = "Registration successful";
        res.json(req.response);
    }
    catch (err) {
        next(err)
    }
}

var deleted = async (req, res, next) => {

    try {
        const { emp_uid } = req.params
        const result = await usermodel.deleteusermodel({ emp_uid })
        if (!result) throw new Forbidden("Sorry! we cannot process this request.");
        req.response.data = result
        req.response.message = "deleted the user details using the uid"
        res.json(req.response)
    }
    catch (err) {
        next(err)
    }
}
var getid = async (req, res, next) => {

    try {
        const { emp_uid } = req.params
        const [result] = await usermodel.getusermodel({ emp_uid })
 
        if (!result) throw new Forbidden("Sorry! we cannot process this request.");
        req.response.data = result
        req.response.message = "getting the user details using uid"
        res.json(req.response)
    }
    catch (err) {
        next(err)
    }
}

var update = async (req, res, next) => {

    try {
        const { firstName, lastName, email, password, designation, profilePicture } = req.body
        const { emp_uid } = req.params
        console.log(req.body,"password")
        // const userdetails=await usermodel.getusermodel({emp_uid,includeId:true})
        // if (!userdetails) throw new Forbidden("Sorry! we cannot process this request.");
        const pass = await passwordHashHelper.generatePasswordHash(password)
        const result = await usermodel.updateusermodel({ emp_uid }, { firstName, lastName, email, designation, password: pass, profilePicture})
        req.response.data = {
            email: email,
            firstName:firstName,
            password: password,
            lastName:lastName,

        }
        req.response.message = "updated the user details"
        res.json(req.response)
    }
    catch (err) {
        next(err)
    }
}





module.exports = {
    get: get,
    update: update,
    deleted: deleted,
    create: create,
    getid: getid

}











