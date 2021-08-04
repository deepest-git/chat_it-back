const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const connectDB=require('./config/db');
const users=require('./routes/api/user');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]}
  });
var cors = require('cors');
const Users = require('./models/users');
const Msg = require('./models/msg');

connectDB();

app.use(cors({ origin: true, credentials: true }));
// Init Middleware
app.use(express.json({ extended: false }));
// use Routes
app.use('/api/user', users);
app.get('/', (req, res) => res.send('chat-it app'));

var userLog={};
const logUser=(user)=>{
  if(userLog[user]===undefined)userLog[user]='online';
  else{delete userLog[user]}
  console.log("---Users---");
  console.log(userLog);
}

var log={};
const logger=(id,name)=>{
  /*id:{
    user:xxx,
    fun:f,
    status:xxx
  } */
  
  if(log[id]===undefined){log[id]=name;logUser(name)}
  else{logUser(log[id]);delete log[id]}
  console.log("---logger---");
  console.log(log);
}

const sendLog=()=>{
  io.emit('userLog',userLog);
}

var rooms={};

io.on('connection', (socket) => {
    console.log('a user connected '+socket.id);

    socket.on('disconnect',()=>{
      logger(socket.id);
      sendLog();
      console.log('dis.. '+socket.id)
    });     

    socket.on('log',(msg)=>{
      logger(socket.id,msg);
      sendLog();
    });

    socket.on('rooms',(usrNm,cb)=>{
      Msg.find({'to':usrNm.to})
      .exec((err,msgs)=>{
        cb(msgs);
      })
    });

    socket.on('typing',(toUsr)=>{
      console.log(toUsr);
      console.log('duh typin....'+toUsr);
      socket.broadcast.emit('typing',{to:toUsr.to,frm:toUsr.frm});//send(typing from to)
    });

    socket.on('msg',(msgToUsr,cb)=>{
      Msg.create(msgToUsr)
      .then(res=>cb('tick'));
      socket.emit('msg',msgToUsr);
    });

    socket.on('chkFrmTo',(frmTo,cb)=>{

      Msg.aggregate([
        {'$match':{'to':frmTo.to,'frm':frmTo.frm}},
        {'$group':{'frm':frmTo.frm}}
      ],(err,data)=>{
        cb(data);
      });
      // Msg.find({'to':frmTo.to,'frm':frmTo.frm})
      // .exec((err,msgs)=>{
      //   cb(msgs);
      // })
    });
});



const port = process.env.PORT || 8082;
server.listen(port, () => console.log(`Server running on port ${port}`));