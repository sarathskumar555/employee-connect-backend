const jwt = require("jsonwebtoken")
const config = require("../server/config");
const redisHelper = require("./redishelper")
const {
    ServerError,
    BadRequest,
    Forbidden,
    NotFound,
    UnauthorizedRequest,
} = require("./errorHelper");
const moment = require("moment");
const loginModel = require("../models/loginModel");
const bodyParser = require("body-parser");


var validate_token = (req, res, next) => {
    try {
        
        var token = req.headers["x-access-token"];
        var refresh_token = req.headers["refresh-token"];
        console.log(token,"tokendata")
        
        // console.log({ apiAccessToken: token });
        if (token || refresh_token) {
           
        
        jwt.verify(token, config.jwt_secret, async function (err, decoded) {
            console.log("decoded",decoded)
            if (err) {
                if (refresh_token) {
                    jwt.verify(refresh_token, config.jwt_secret, async function (
                        err,
                        decoded
                    ) {
                        if (err) {
                            res.setHeader("authorization", false);
                            req.response.invalidToken = true;
                            jwt.verify(
                                token,
                                config.jwt_secret,
                                { ignoreExpiration: true },
                                async (err, decoded) => {
                                    if (decoded) {
                                        await loginModel.update({
                                            data: { status: 'expired' },
                                            uid: decoded.jti,
                                        });
                                    }
                                }
                            );
                            next(new UnauthorizedRequest("Authentication failed"));
                        } else {
                            req.decoded = decoded;
                            let isBlackListed = await redisHelper.isBlackListed({
                                jti: decoded.jti,
                            });
                            if (!isBlackListed) {
                                var user_info = { user_uid: decoded.user_uid, login_uid: decoded.login_uid };
                                var newtoken = jwt.sign(user_info, config.jwt_secret, {
                                    expiresIn: "1d",
                                });
                                res.setHeader("authorization", true);
                                res.setHeader("x-access-token", newtoken);
                                next();
                            } else {
                                res.setHeader("authorization", false);
                                req.response.invalidToken = true;
                                next(new UnauthorizedRequest("Session expired"));
                            }
                        }
                    });
                } else {
                    res.setHeader("authorization", false);
                    req.response.invalidToken = true;
                    next(new UnauthorizedRequest("Authentication failed"));
                }
            } else {
                let isBlackListed = await redisHelper.isBlackListed({
                    jti: decoded.jti,
                });
                if (!isBlackListed) {
                    res.setHeader("authorization", true);
                    req.decoded = decoded;
                    next();
                } else {
                    next(new UnauthorizedRequest("Session expied"));
                }
            }
        })
       

        }
        else {

            res.setHeader("authorization", false);
            req.response.invalidToken = true;
            next(new UnauthorizedRequest("Authentication failed"));
        }}
    catch (error) {
        next(error);
    }
}
var generate_token = (payload, ttl = 30) => {
    console.log("paylad", payload)
    return new Promise((resolve, reject) => {
        try {
            var data = {};
            Object.keys(payload).forEach((key) => {
                if (key == "user_uid" || key == "login_uid" || key == "email" || key == "otp")
                    data[key] = payload[key];
            });
            let auths = {};
            var token = jwt.sign(data, config.jwt_secret, {
                expiresIn: `${ttl}d`,
                jwtid: data["login_uid"] ? data["login_uid"].toString() : "1",
            });
            var refresh_token = jwt.sign(data, config.jwt_secret, {
                expiresIn: "90d",
                jwtid: data["login_uid"] ? data["login_uid"].toString() : "1",
            });
            auths.token = token;
            auths.refresh_token = refresh_token;
            console.log(auths, "after")
            resolve(auths);
        } catch (error) {
            reject(error);
        }
    });
}

var revokeToken= ({ jti }) => {
    console.log("jtiiiiiiiiiiiiii",{jti})
    const curDate = moment();
    console.log(curDate,"curDate")
    const exp = curDate.clone().add(30, "days");
    console.log("exp",exp)
    exp
        .set("hours", 23)
        .set("minutes", 59)
        .set("seconds", 59)
        .set("milliseconds", 999);
    const redis_expiry = exp.get("milliseconds") - curDate.get("milliseconds");
    console.log("redis_expiry",redis_expiry)
    const key = moment(exp).format("DDMMYYYY");
    console.log("key",key)
    return redisHelper.addToRedisBlackList({
        key,
        jti: jti,
        redis_expiry_at: Math.floor(redis_expiry),
    });
}
var verify_token=({access,refresh})=>{
return new Promise((resolve,reject)=>{

    jwt.verify(access, config.jwt_secret, async function (err, decoded) {
        
        resolve (decoded)
    })


})
    



}
   
module.exports = {
    validate_token: validate_token,
    generate_token: generate_token,
    revokeToken:revokeToken,
    verify_token:verify_token

}