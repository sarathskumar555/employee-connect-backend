const passwordHashHelper = require("../../helper/passwordHashHelper.js");
const io= require("../../helper/sockethelper.js");
const loginModel = require("../../models/loginModel");
const usermodel = require("../../models/userModel.js");
const authHelper = require("../../helper/authhelper");
const { UnauthorizedRequest } = require("../../helper/errorHelper.js");

var login = async (req, res, next) => {
    try {
        const { firstName, password } = req.body;
        const [result] = await usermodel.findUserName({ firstName });
        console.log("resultttttttttt", result)
        if (!result) throw new UnauthorizedRequest("incorrect username or password");
        const pass = await passwordHashHelper.comparePasswordHash(
            password,
            result.password
        );
        if (!pass) throw new UnauthorizedRequest("incorrect usrname or password");
        const { uid: login_uid } = await loginModel.create({
            user_id: result.id,
            // fcm_id: body.fcm_id,
        });

        let tokenData = {
            user_uid: result.uid,
            login_uid,
        };
        const { token, refresh_token } = await authHelper.generate_token(
            tokenData,
            1
        );

        res.setHeader("authorization", true);
        res.setHeader("x-access-token", token);
        res.setHeader("refresh-token", refresh_token);
        req.response.data = {
            email: result.email
            , firstName: result.firstName
            ,lastName: result.lastName
            , uid: result.uid
        };
        req.response.message = "login successfully";
        res.json(req.response);
    } catch (err) {
        next(err);
    }
};
var removeSession = async (req, res, next) => {
    try {
        const { decoded } = req;
        authHelper.revokeToken({ jti: decoded.jti });
        loginModel.update({ uid: decoded.jti, data: { status: 'loggedout' } });
        req.response.message = "Logout successfully";
        res.json(req.response);
    } catch (error) {
        next(error);
    }
}


var chatSession=async()=>{
io.getIO().emit('posts',"sarath")
}

module.exports = {
    login: login,
    removeSession: removeSession,
    chatSession:chatSession
};



