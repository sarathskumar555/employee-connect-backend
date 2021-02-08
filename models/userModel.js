const database = require('../server/database.js')
const utilHelper = require("../helper/utilshelper.js")


var insertusermodel = async ({
  firstName,
  lastName,

    email,
  
    password,
    designation,
    profilePicture
}) => {
    const result = await database.insert("employees", { firstName, lastName, email, password, designation, uid: utilHelper.uniqueId('emp'), profilePicture})

    return result

}

var getusermodel = async ({ emp_uid = null,isInclude=false}) => {
    let sql = `SELECT 
    e.firstName
    ,e.lastName
   ,e.email
    ,e.password
     ,e.designation
    ,e.uid
    ,e.profilePicture
   ${isInclude?',e.id':''}
    FROM employees e
    WHERE 1`;
    let array = [];
    if (emp_uid) {
        sql += ` AND e.uid=?  `
        array.push(emp_uid)
    }
  
    const result = await database.selectQuery(sql, array)
    return result

}
var deleteusermodel = async ({ emp_uid }) => {
    const cond = { uid: emp_uid }
    const result = await database.delete_row("employees", cond)
    return result


}
var updateusermodel = async ({ emp_uid }, { firstName, lastName, email, designation, password, profilePicture}) => {
    const cond = { uid: emp_uid }
    const result = await database.update("employees", { firstName, lastName, email, designation, password, profilePicture}, cond)
    return result

}

var findUserName = async ({ firstName}) => {
    const result = await database.login("employees", firstName)
    return result

}
module.exports = {
    insertusermodel: insertusermodel,
    getusermodel: getusermodel,
    deleteusermodel: deleteusermodel,
    findUserName:findUserName,
    updateusermodel: updateusermodel
}