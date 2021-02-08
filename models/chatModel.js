const database = require('../server/database.js')
const utilHelper = require("../helper/utilshelper.js")


var insertchatmodel = async ({
   fromUID,
   toUID ,
   message
}) => {
    const result = await database.insert("chatmessages", { fromUID,toUID,message })

    return result

}
var getchatmodel = async ({ emp_uid = null})=>{

    let sql = `SELECT 
    c.fromUID
    ,c.toUID
    ,c.message
   
    FROM chatmessages c
    WHERE 1`;
    let array = [];
    if (emp_uid) {
        sql += ` AND c.toUID=?  `
        array.push(emp_uid)
    }
    const result = await database.selectQuery(sql, array)
    return result


}

var chatExist=async({user1,user2})=>{

    let sql =`SELECT chat_master.uid
         FROM chat_master where (chat_master.user1=${user1} and chat_master.user2=${user2})or
         (chat_master.user1=${user2} and chat_master.user2=${user1});`
    let array = [];
    const result = await database.selectQuery(sql, array)
    if(!result)return false
    return result


}
var chatMaster= async({user1,user2})=>{
    let data = { user1, user2, uid: utilHelper.uniqueId('chat')}
    const result = await database.insert("chat_master",data)
result['uid']=data.uid
    return result


}




module.exports={
insertchatmodel:insertchatmodel,
getchatmodel:getchatmodel,
chatExist:chatExist,
chatMaster:chatMaster
}