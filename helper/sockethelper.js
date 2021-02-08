const config = require('../server/config')
const jwt = require("jsonwebtoken");
const authHelper = require("./authhelper");

const {
    UnauthorizedRequest,
    BadRequest,
    Forbidden,
    NotAcceptable,
} = require("./errorhelper");

var socketHelper = {};
var io;
var socket;
var connectedSockets = new Map();

socketHelper.init = async (server)=>{
    io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        }
    })
    io.use(async (_socket, next) => {
        try {
            const cookie = _socket.handshake.query
            const { access, refresh } = cookie
            const decoded = await authHelper.verify_token({ access, refresh })
            if (decoded) {
                uid = decoded.user_uid
            }
            else {
                throw new UnauthorizedRequest();
            }
            connectedSockets.set(decoded.user_uid, _socket);

            // console.log(connectedSockets, "sarath")
            socket = _socket;
            socket["user"] = decoded;
            _socket["user"] = decoded;
            next(_socket)
        }
        catch (err) {
            next(err);
        }
    })

    io.on("connection", async (_socket) => {
        console.log(`${_socket.user.user_uid} conected`)
        socket = _socket;
        socket.emit("uid", (socket.user.user_uid))
        // room1 = socket.user.user_uid


        //  socket.join("B")
        // socket.on("toUID", (obj) => {
        //     room2 = obj
        //     socket.join(`${room1}_${room2}`)
        //     console.log(`${room1}_${room2}`,"aswathyddd")
        // })
        // socket.join(`room_${socket.user.user_uid}`);
        //     socket.on("disconnect", () => {    
        //         connectedSockets.delete(socket.user.user_uid);
        //     });
        socket.on("message", (obj) => {
            const { fromUID, toUID, message, roomID } = obj;
            console.log(obj, "hhhh")
            io.in(`${roomID}`).emit("chat", obj);

        });
        socket.on("disconnect", () => {
            connectedSockets.delete(socket.user.user_uid);
            console.log(`${socket.user.user_uid} disconnected`);
        });
    });
}

socketHelper.joinRoom = async ({ room, user_uid }) => {
    rooms = room

    let socket = connectedSockets.get(user_uid);
    // console.log(socket,"get")
    if (socket) {
        console.log("joined", room)
        // console.log("roomed",`"${room}"`)
        socket.join(`${room}`)
        // socket.join("B")
    } else {
        console.log(`${user_uid} not connected`);
    }
}


// var appSocket = (() => {
//     let io
//     users = []
//     var socket_io;
//     var socket;
//     let rooms;
//     // let room2;

//     var connectedSockets = new Map();
//     let createConnection = async (server) => {
       
//     }
//     return {
//         init: function (httpServer) {
//             createConnection(httpServer)
//         },

//         joinRoom: ({ room, user_uid }) => {
//             rooms=room
           
//             let socket = connectedSockets.get(user_uid);
//             // console.log(socket,"get")
//             if (socket) {
//                 console.log("joined", room)
//                 // console.log("roomed",`"${room}"`)
//                 socket.join(`${room}`)
//                 // socket.join("B")
//             }else{
//                 console.log('not connected');
//             }
//         },
//         sendToRoom: ({ chanel, room, payload, user_uid }) => {
//             // let socket = connectedSockets.get(user.user_uid);
          
//             // socket.on("message", (obj) => {
//                 // console.log(obj, "sssssss")
//                 io.in(`${room}`).emit(chanel, payload);
//             // });


//         },
//         broadcast: async ({ chanel, payload }) => {
//             try {
//                 // console.log(`Sending to: ${chanel}`, payload);
//                 io.emit(chanel, payload);
//             } catch (error) {
//                 throw error;
//             }
//         },
//         leaveRoom: ({ uuid, room }) => {
//             let socket = connectedSockets.get(uuid);
//             if (socket) {
//                 socket.leave(`room_${room}`);
//                 connectedSockets.delete(uuid);

//             }
//         }
//     }
// })();
module.exports = socketHelper
