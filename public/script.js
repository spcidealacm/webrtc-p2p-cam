const socket = io('/')

function* generateTime() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const getTimes = generateTime();

const peerList = [];

const videoShow = document.getElementById('video-show')

const myPeer = new Peer(undefined, {
  host: '/',
  port: '5051'
})

const myVideo = document.createElement('video')
myVideo.muted = true



myPeer.on('open', id => {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {

    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
      console.log('new one revice call answer stream')
      call.answer(stream);
      call.on("stream", stream => {
        if (!peerList[call.peer]) {
          const video = document.createElement('video');
          addVideoStream(video, stream);
          console.log('call: ', call);
          peerList[call.peer] = call;
        }
      })
    })

    socket.on('user-connected', userId => {
      console.log(`Device connect userId: ${userId}`)
      connectToNewUser(userId, stream)
    })

    socket.emit('join-room', ROOM_ID, id)
  })
})

socket.on('user-disconnected', userId => {
  if (peerList[userId]) {
    peerList[userId].close();
  }
});


function addVideoStream(video, stream) {
  console.log(getTimes.next().value);
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoShow.append(video)
}


function connectToNewUser(userId, stream) {
  console.log('going to call')
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    console.log('old one receive steam')
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove();
  })
  console.log('userId: ', userId);
  peerList[userId] = call;
}