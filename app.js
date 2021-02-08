const express = require('express');
const app = express();
var cors = require('cors')
const socketio = require('socket.io')
// const io = require("./helper/sockethelper.js");

const userCrud = require('./routers/employee/userRouter');
const userChat = require('./routers/employee/chatRouter.js');
const loginUser = require('./routers/employee/index');
const loginAdmin = require('./routers/admin/index');
const adminCrud = require('./routers/admin/adminRouter');

const user = require('./models/userModel.js')
const fileLogger = require("./helper/loghelper");
const responseHelper = require("./helper/responsehelper");
const socketHelper = require("./helper/sockethelper")
const authHelper = require("./helper/authhelper");
const admin = require('./models/adminModel.js');
const { Socket } = require('socket.io');
const { request } = require('express');
const { decode } = require('jsonwebtoken');
var http=require('http')

require('dotenv').config();
app.use(cors({
    allowedHeaders: ["sessionId", "Content-Type", "Accept", "authorization", "x-access-token", "refresh-token"],
    exposedHeaders: ["sessionId", "x-access-token", "refresh-token", "authorization"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //  'preflightContinue': false
}))
app.use(express.json());
// app.use(cors())
app.use(responseHelper.setReponse)


app.use('/user/userCrud', userCrud);
app.use('/admin/adminCrud', adminCrud);

app.use('/user', loginUser);
app.use('/admin', loginAdmin);


app.use('/user/userChat',userChat)


app.use(function (error, req, res, next) {
    error.code != 404 &&
        error.code != 401 &&
        fileLogger.error(error);

    res.locals.message = error.message;
    res.locals.error = req.app.get("env") === "development" ? error : {};
    if (error.code && typeof error.code == "number") {
        if (req.response) {
        }
        req.response.message = error.code ? error.message : "Something went wrong";
        res.status(error.code || 500);
        res.json(req.response);
    } else {
        req.response.message = "Internal Server error";
        res.status(500);
        res.json(req.response);
    }
});
const port = '3500'
const host = "localhost"
// app.set("port",port)
// var server=http.createServer(app)





// server.listen(port,host,()=>{
//     console.log(`listening to the port ${port}${host}`)
// })


const server= app.listen(port, host,function(){
    console.log(`listening to the port ${port}${host}`)
})


socketHelper.init(server)
// const io = require('./helper/sockethelper').init(server)


// let token=[]
// var connectedSockets = new Map();
// io.use ( async (socket, next)=> {
//     const cookie = socket.handshake.query
//     const { access, refresh } = cookie
//     const decoded = await authHelper.verify_token({ access, refresh })
    
//     if (decoded !== undefined) {
//         const { user_uid } = decoded
//         uid=user_uid
//         if(!connectedSockets.get(user_uid)) connectedSockets.set(user_uid,socket)
//         next();
        
//     }

   

// })

// users = []       
// io.on('connection', socket => {

//     console.log("New Web Socket Connection")
//     const data = {
//         message:"welocome",
//         user_id:uid
//     }

//     socket.emit('message1', data)

//     socket.on('username', (uid) => {
//         users.push({
//             id: socket.id,
//             userName: uid
//         })

//         let len = users.length;
//         len--

//         io.emit('userList', users, users[len].id)
//     })

//     socket.on('getMsg', (data, callback) => {
//        const data1={msg:data.msg,
//             reciever:data.name,
//             sender : uid,
//                 createdAt : new Date().getTime()
//     }
//         socket.broadcast.to(data.toid).emit('sendMsg', data1)
//         callback('Message Delivered')
//     })

//     socket.on('disconnect', () => {
//         for (let i = 0; i < users.length; i++) {

//             if (users[i].id === socket.id) {
//                 users.splice(i, 1);
//             }
//         }
//         io.emit('exit', users);
//     })
// })

























