const express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");
const path = require("path");
const config = require("./config/config.json")

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})


io.on('connection', (socket) => {
  console.log('connect');
  socket.on('join-room', (roomId, userId) => {
    console.log(`roomId: ${roomId}`, `userId: ${userId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('disconnect', ()=>{
      socket.to(roomId).emit("user-disconnected", userId);
    })
  })
})


const PORT = process.env.PORT || config.port;
server.listen(PORT, () => {
  console.log("================================");
  console.log(`VIDEO DEMO SERVER START: ${PORT}`);
  console.log("================================");
})
