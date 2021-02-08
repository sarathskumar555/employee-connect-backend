const redisLib = require("redis");
const {
    BadRequest,
    ServerError,
    UnauthorizedRequest,
    Forbidden,
} = require("./errorHelper");

const redis = {};
const redisClient = redisLib.createClient({
    port: 6379,
    host: "127.0.0.1"

});

redisClient.on('error', function (err) {
    console.log('redis is not running');
    console.log(err);
});
redisClient.on('ready', function () {
    console.log('redis is running');
});
redisClient.get('framework', function (err, reply) {
    console.log(reply);
});

redis.addToRedisBlackList = ({ jti, key, redis_expiry_at }) => {
    return new Promise((resolve, reject) => {
        addToList({ key: "keyList", value: key })
            .then(addToList({ key, value: jti }))
            .then(addExpireAt({ key, expireat: redis_expiry_at }))
            .then(resolve(true))
            .catch((err) => reject());
    });
};

redis.isBlackListed = async ({ jti }) => {
    try {
        if (!jti)
            return true;
        let keys = await getListMembers({ key: "keyList" });
        let valueIndex = -1;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            try {
                var jtis = await getListMembers({ key });
                valueIndex = jtis.indexOf(jti);
                if (valueIndex > -1) {
                    break;
                }
            } catch (error) {
                return true;
            }
        }
        if (!(valueIndex > -1))
            return false;
        return true;
    } catch (error) {
        throw error;
    }
};



function addToList({ key, value }) {
    return new Promise((resolve, reject) => {
        redisClient.sadd(key, value, (err, reply) => {
            if (!err)
                resolve(reply);
            reject(err);

        });
    });
}



function getListMembers({ key }) {
    return new Promise((resolve, reject) => {
        redisClient.smembers(key, (err, replies) => {
            if (!err)
                resolve(replies);
            reject(err);

        });
    });
}



function addExpireAt({ key, expireat }) {
    return new Promise((resolve, reject) => {
        redisClient.expire(key, +expireat, (err, reply) => {
            if (!err)
                resolve(reply);
            reject(err);

        });
    });
}

module.exports = redis;