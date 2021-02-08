

const bcrypt = require('bcrypt');
const saltRounds = 10;

var generatePasswordHash = (data) => {
    return new Promise(async (resolve, reject) => {

        await bcrypt.hash(data, saltRounds, function (err, hash) {
            if (!err) { resolve(hash) }
            reject(err)
        });
    })
}
var comparePasswordHash = (data, hash) => {

    return new Promise(async (resolve, reject) => {
        await bcrypt.compare(data, hash, function (err, result) {
            if (!err) { resolve(result) }
            reject(err)
        })
    })
}


module.exports = {
    generatePasswordHash: generatePasswordHash,
    comparePasswordHash: comparePasswordHash
}