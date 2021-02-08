// const adminModel = require('../../models/adminModel')
// const loginModel = require('../../models/loginModel')
const io = require('../../helper/sockethelper')
const chatmodel = require('../../models/chatModel.js');
const usermodel = require('../../models/userModel.js');
const utilHelper = require("../../helper/utilshelper.js")


const { BadRequest, NotFound, NotAcceptable, ServerError } = require('../../helper/errorhelper');


var  postDetails =async (req, res, next) => {
    try {
        const { fromUID, toUID,message } = req.body
        const payload={
            fromUID,
            toUID,
            message
        }
        // io.sendToRoom({ chanel: "message", room: `${fromUID}_${toUID}`, payload, user_uid: fromUID})
        const result = await chatmodel.insertchatmodel({ fromUID, toUID ,message})
        req.response.data = {

            fromUID,
            toUID,
            message
        }
        req.response.message = "chat messages posted succesfully";
        res.json(req.response);
        
    }
    catch (error) {
        next(error)
    }
}


var getDetails =async (req, res, next) => {
  
    try {
        const{fromUID,toUID}=req.query
let room;
       
        const [fromUserdetail] = await usermodel.getusermodel({ emp_uid:fromUID,isInclude:true })
        const [toUserdetail] = await usermodel.getusermodel({ emp_uid: toUID, isInclude: true })
        let user1=fromUserdetail.id
        let user2=toUserdetail.id
       var [chatDetails]= await chatmodel.chatExist({user1,user2})
       if(!chatDetails){

        const res= await chatmodel.chatMaster({user1,user2})
                  room=res.uid
       }
       else{

          room=chatDetails.uid
       }
        io.joinRoom({ room: `${room}`, user_uid: fromUID })
        const { emp_uid } = req.params
        const result = await chatmodel.getchatmodel({ emp_uid: fromUID })
          
        if (!result) throw new Forbidden("Sorry! we cannot process this request.");
        req.response.data['room']=room
        req.response.data['messages'] = result
        req.response.message = "getting the chat  details using uid"
        res.json(req.response)






    } catch (error) {
        next(error)
    }
}


module.exports = {
    postDetails: postDetails,
    getDetails: getDetails
}