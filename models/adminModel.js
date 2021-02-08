const database = require('../server/database.js')
const utilHelper = require("../helper/utilshelper.js")


var insertadminModel = async ({
    name,
    email,
    mobile_number,
    password,
}) => {
    const result = await database.insert("admin", { name, email, mobile_number, password, uid: utilHelper.uniqueId('adm') })

    return result

}


var getadminModel = async ({ emp_uid = null }) => {
    let sql = `SELECT 
    e.email
    ,e.name 
    ,e.mobile_number
    ,e.password
    ,e.uid
    FROM admin e
    WHERE 1`;
    let array = [];
    if (emp_uid) {
        sql += ` AND e.uid=?  `
        array.push(emp_uid)
    }
    console.log(sql)
    console.log(array)
    const result = await database.selectQuery(sql, array)
    return result

}

var deleteadminModel = async ({ emp_uid }) => {
    const cond = { uid: emp_uid }
    const result = await database.delete_row("admin", cond)
    return result


}



var updateadminModel = async ({ emp_uid }, { name, mobile_number, password, email }) => {
    const cond = { uid: emp_uid }
    const result = await database.update("admin", { name, email }, cond)
    return result

}
var loginname = async ({ name }) => {


    const result = await database.login("admin", name)
    return result

}


module.exports = {
    insertadminModel: insertadminModel,
    getadminModel: getadminModel,
    deleteadminModel: deleteadminModel,
    loginname: loginname,
    updateadminModel: updateadminModel
}