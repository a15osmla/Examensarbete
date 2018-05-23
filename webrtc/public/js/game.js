var testdata = "rtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwerqwertrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwerqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqweqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwwqwewqwertqwertqwerqwertrtwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwert";

// 1 kb
var serverData = "rtqwertqwertqwertqwertqwertqwertqwerqwertrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwerqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqweqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwerqwrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwerqwwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqweewqewqqqwertqwertqwertrrtqwertqrtqwertqwertqwertqwertqwertqwertrrtqwertqrtqwertqwertqwertrrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwertrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwerttqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwertwwqwewqwertqwertqwerqwertrtwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwert";
//testdata = "212312331231212312123123321231233123123123121212312123123321231233123121231212312332";
localStorage.clear();
var socket = io.connect();
var peerConn;
var storage = localStorage.setItem("ms ", " ");
var dataChannel;
var sessionId;
var testing;
var pongTime;
var pingTime;
var latency;
var host;
var peers =     [];
var peerConnections = [];
var dataChannels = [];
var start;
var hostId;
var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var config = {
	'iceServers': [{'url': 'stun:stun.1und1.de'},
                   //url:'stun:stun1.l.google.com:19302'},
    ]
};

//------------------------------------------------- TEST --------------------------------------------------------------

var pingTest = false;
function startPingTest() {
  if (!pingTest) {
      pingTest = true;
      var interval = setInterval(function(){
          var msg = {type:"pingServer", ping:Date.now(), data:testdata};
          dataChannel.send(JSON.stringify(msg)); 
    }, 1000/60);
  }
}

var dataTest = false;
function startDataTest() {
    if (!dataTest) {
        dataTest = true;
        var interval = setInterval(function(){
        var msg = {type:"sendDataTest", test:testdata};
        dataChannel.send(JSON.stringify(msg)); 
    }, 1000/60);
  }
}

var hosting = false;
var starter = false;

var hostButton = document.getElementById("host");
hostButton.addEventListener("click", function () {
    host = sessionId;
    if(hosting == false) {
        hostButton.innerHTML = "You are the host";
        hosting = true;
        createPeerConns();
        createDataChannels();
    }
})
    
var startButton = document.getElementById("start");
startButton.addEventListener("click", function () {        
    if(starter == false) {
        startButton.style.display="none";
        send({type:"host", session:sessionId});
        //sendIceCandidates();
    }
});

var testButton = document.getElementById("test");
testButton.addEventListener("click", function () {        
    if(starter == false) {
        startButton.style.display="none";
        sendTests();
        //sendToAllPeers(msg);
        //sendIceCandidates();
    }
});
var serverTesting = false;
function serverTest() {
    if (!serverTesting) {
        serverTesting = true;
        var interval = setInterval(function(){
        var msg = {type:"recieveData", data:serverData};
        sendToAllPeers(msg);
    }, 1000/60);
  }
}

function sendTests() {
    if (!testing) {
        testing = true;
        var msg = {type:"pingTest"}
        dataChannels[0].send(JSON.stringify(msg));
        //serverTest();
        msg = {type:"dataTest"};
        sendToAllPeers(msg);
    }
}

//----------------------------------------------- Datachannels -------------------------------------------------------

function createDataChannels(){
    for(var x = 0; x < peerConnections.length; x++) {
        dataChannels.push(peerConnections[x].createDataChannel("channel" + [x], dataChannelOptions));
    }
    for(var x = 0; x < dataChannels.length; x++) {
        dataChannels[x].onopen = dataChannelStateChanged;
        dataChannels[x].ondatachannel = receiveDataChannel;
    }
}
 /*       
function sendIceCandidates() {
    for(var x = 0; x < peerConnections.length; x++) {
        var idier = peers[x];
        peerConnections[x].onicecandidate = function (event) { 
            if (event.candidate) { 
                send({ type: "candidate", candidate: event.candidate, session:idier});
            }
        };
        console.log(peerConnections[x]);
    }
}
*/

/*
function sendOffers(index) {
    var x = index;
    var ids = peers[x];

    peerConnections[x].createOffer(function (offer) { 
        peerConnections[x].setLocalDescription(offer); 
        send({ type: "offer", offer: offer, session: ids, host: host, index:x});
    }, function (error) {
    });
}
*/

function createPlayers(){
    for(var x = 0; x < peers.length; x++) {
        players.push(new Player(0.01, 0.6, 0.15, 0.35, 0.004, peers[x]));
    }
}

function createPeerConns() {
    if(hosting == true && host == sessionId) {
        for(var x = 0; x < peers.length; x++) { 
            peerConnections.push(new RTCPeerConnection(config, null));
            //sendOffers(x);
            if(x < peers.length) {
                start = false; 
            }
        }
    }
}

function setupConn() {
    if(!host) {
        peerConn = new RTCPeerConnection(config, null); 
        dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);
        dataChannel.onopen = dataChannelStateChanged;
        peerConn.ondatachannel = receiveDataChannel;
        peerConn.onicecandidate = function (event) { 
            if (event.candidate) { 
                send({ 
                   type: "candidate", 
                   candidate: event.candidate, 
                   session:hostId, peer:sessionId
                });
             } 
        }; 
        
        peerConn.createOffer(function (offer) { 
            send({ type: "offer", offer: offer, session: hostId, peer:sessionId}); 
            peerConn.setLocalDescription(offer); 
        }, function (error) { 
            }); 
    }
}

socket.on('connect', function(data) {
    console.log("This clients id: " + socket.id);
    sessionId = socket.id;
    
    socket.on('users', function(datar) {
        var data = JSON.parse(datar);
        var array = data.users;
        peers.length = 0;

        for(var x = 0; x < array.length; x++) {
            if(sessionId != array[x]) {
                peers.push(array[x]);
                console.log(peers);
            }
        }
    });
});


socket.on('message', function(message) {
    var data = JSON.parse(message); 
    switch(data.type) { 
        case "host":
            if(sessionId != data.host){
                hostId = data.host;
                setupConn();
                startButton.style.display="none";
                testButton.style.display="none";
                hostButton.style.display="none";
                
            }
            break;
        case "offer":    
            if(host) {
                onOffer(data.offer, data.peer);
            }
            break; 
        case "answer":
            onAnswer(data.answer, data.index);
            break; 
        case "candidate":
            onCandidate(data.candidate, data.peer); 
            break; 
        default: 
            break; 
   } 
});

function createAnswer(index, peerId) {
    peerConnections[index].createAnswer(function (answer) { 
        peerConnections[index].setLocalDescription(answer); 
        send({ type: "answer", answer: answer,session: peerId}); 
    }, function (error) { alert("oops...error"); }); 
}

//when somebody wants to call us 
function onOffer(offer, peerId) {
    if(host) {
      for(var x = 0; x < peers.length; x++) {
            if(peerId == peers[x]) {
                peerConnections[x].setRemoteDescription(new RTCSessionDescription(offer), function() {
                },  console.error.bind(console));
                createAnswer(x, peerId);
            }
        }  
    } else {
        peerConn.setRemoteDescription(new RTCSessionDescription(offer), function() {
        },  console.error.bind(console));
        
        peerConn.createAnswer(function (answer) { 
            peerConn.setLocalDescription(answer); 
            send({ type: "answer", answer: answer,session: hostId,index: index}); 
        }, function (error) { 
              alert("oops...error"); 
        }); 
    }
}

//when another user answers to our offer 
function onAnswer(answer, index) {
   peerConn.setRemoteDescription(new RTCSessionDescription(answer), function() {
   },  console.error.bind(console));
}

function send(message) {
    socket.emit("message", (JSON.stringify(message)));
    console.log("sending to server," +  JSON.stringify(message));
}

//when we got ice candidate from another user 
function onCandidate(candidate, peerId) { 
    if(host) {
        for(var x = 0; x < peers.length; x++) {
            if(peerId == peers[x]) {
                peerConnections[x].addIceCandidate(new RTCIceCandidate(candidate));
                console.log(peerConnections);
            }
        }
    } else {
      peerConn.addIceCandidate(new RTCIceCandidate(candidate));  
    }
}


//Data Channel Specific methods
function dataChannelStateChanged(event) {
    var channelLabel = event.currentTarget.label;
    if(host) {
        for(var x = 0; x < dataChannels.length; x++) {
            if (dataChannels[x].readyState === 'open') {
                dataChannels[x].onmessage = receiveDataChannelMessage;
                if(x <= dataChannels.length) {
               
                }
            }
        }
    }
    else {
        if (dataChannel.readyState === 'open') {
            dataChannel.onmessage = receiveDataChannelMessage;
	   }
    }
}

function receiveDataChannel(event) {
    if(host) {
        for(var x = 0; x < dataChannels.length; x++) {
            dataChannels[x] = event.channel;
            console.log(dataChannel[x]);
        }
            dataChannels[x].onmessage = receiveDataChannelMessage; 
    } else {
       dataChannel = event.channel;
	   dataChannel.onmessage = receiveDataChannelMessage; 
    }
}


function sendToAllPeers(data) {
    for(var x = 0; x < dataChannels.length; x++) {
        setTimeout (console.log.bind (console, "Send to all peers \n"));
        dataChannels[x].send(JSON.stringify(data));
    }
}

function pingllPeers(data) {
    for(var x = 0; x < dataChannels.length; x++) {
        setTimeout (console.log.bind (console, "Send to all peers \n"));
        dataChannels[x].send(JSON.stringify(data));
    }
}

function pingAllPeers(data) {
    for(var x = 0; x < dataChannels.length; x++) {
        setTimeout (console.log.bind (console, "Send to all peers \n"));
        if(x != 0) {
           dataChannels[x].send(JSON.stringify(data)); 
        }
    }
}

function receiveDataChannelMessage(event) {
    socket.disconnect();
    var parsedData = JSON.parse(event.data);
    //console.log(event.data);
    
    // --------------------------      Ping channel 1     -------------------------------------
    
    if(parsedData.type == "pingTest") {
        startPingTest();
    }
    
    if(parsedData.type == "pingServer") {
        var msg = {type:"pingReciever", ping:parsedData.ping, data:testdata};
        //dataChannels[1].send(JSON.stringify(msg)); 
        pingAllPeers(msg);
        console.log("pingServer");
    }
    
    if(parsedData.type == "pingReciever") {
        pingTime = parsedData.ping;
        var msg = {type:"pongServer", ping:pingTime}
        dataChannel.send(JSON.stringify(msg));
    }
    
    if(parsedData.type == "pongServer") {
        pingTime = parsedData.ping;
        var msg = {type:"latency", ping:pingTime}
        dataChannels[0].send(JSON.stringify(msg));
    }
        
    if(parsedData.type == "latency") {
        var pongTime = Date.now();
        pingTime =parsedData.ping;
        var ms = (pongTime - pingTime);
        setTimeout (console.log.bind (console, ms));
        /*var old = localStorage.getItem("ms");
        var news = old + ms + "\n";
        localStorage.setItem("ms", news);*/
    }

    // -------------------------- Handle player input -------------------------------------
    if(parsedData.type == "input") {
        var player;
        for(var x = 0; x < players.length; x++) {
            if(players[x].peerId == parsedData.peerId) {
                player = player[x];
            }
        } 
        switch(data.action) {   
            case "block":
                player.blocking = true; 
                break;
            case "punch":
                player.punching = true;
                break;
            case "block":
                break;
            case "left":
                    
                break;
            case "right":
                
                break;
            case "jump":
                break;
        }
            
    }
    
    if(parsedData.type == "recieveData") {
        //console.log(parsedData.data);
    }
    
    if(parsedData.type == "recieveUpdate") {
        players = parsedData.update;
    }
    
    if(parsedData.type == "dataTest") {
        startDataTest();
    }
    
    if(parsedData.type == "sendDataTest") {
    }
}



var ctx, width, height, canvas;
var Game = {};  
var keys = {};
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop, thisFrameTime;
var lastDir;
var players = []

Game.fps = 60;
Game.maxFrameSkip = 10;
Game.skipTicks = 1000 / Game.fps;
Game.oldTick;


var sprite_sheet = {
    // P1
    frame_sets:[[0],// set 0: Stand right
                [1,2,3,4,5,6],// set 1: Walk right
                [7,8,9], // set 2: jump right
                [10], // set 3: block right
                [13,12], // set 4: punch right
                [14], // set 5: stand left
                [20,19,18,17,16,15], // set 6: walk left
                [25,26], // set 7: punch left
                [24], // set 8: block left
                [23,22,21] // set 9: block left
                ],
    // P2
    frame_sets2:[[28] //  
    ],
    image:new Image()
  };

/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

 /* Each sprite sheet tile is 16x16 pixels in dimension. */
  var SPRITE_SIZE = 50;

  /* The Animation class manages frames within an animation frame set. The frame
  set is an array of values that correspond to the location of sprite images in
  the sprite sheet. For example, a frame value of 0 would correspond to the first
  sprite image / tile in the sprite sheet. By arranging these values in a frame set
  array, you can create a sequence of frames that make an animation when played in
  quick succession. */
  var Animation = function(frame_set, delay) {
    this.count = 0;// Counts the number of game cycles since the last frame change.
      
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.
  };

  Animation.prototype = {
      

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change:function(frame_set, delay = 5) {

      if (this.frame_set != frame_set) {// If the frame set is different:
        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame = this.frame_set[this.frame_index];// Set the new frame value.
      }
        

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.
            
      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Change the current frame value.
      }

    },
      
    // Get the current frame_index
    getFrame:function() {
        return this.frame_index;
    }
}

function Player(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.orgSpeed = speed;
    this.grounded = false;
    this.jumping = false;
    this.blocking = false;
    this.velY = 0;
    this.velX = 0;
    this.startY = y;
    this.gravity = speed/2;
    this.hp = 100;
    this.animate = new Animation();
    this.moving = function(dir) {
        if(dir == "right") {
            this.x = this.x+this.speed;
        }
        else if(dir == "left") {
            this.x = this.x-this.speed;
        } 
    }
}


document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
        keys[e.keyCode] = false;
});

var punching;
function punch() {
    if (!punching) {
        punching = true;
        var contact = colCheck(p2,p1);
        var currentFrame = p1.animate.getFrame();
  
        if (contact == "r"  && p2.hp > 10 || contact == "l" && p2.hp > 10) {
                if(contact == "r" || contact == "l") {
                        p2.hp -= 5;
                }
        }
        
        setTimeout(function(){ punching = false; },475);
    }
}

Game.input = function() { 
    //p2.animate.change(sprite_sheet.frame_sets2[0], 8);
    //var msg = {start:Date.now(), testdata:testdata};
    
    //Start test
    /*canvas.addEventListener('click', function() {
        /*
        if (dataChannel.readyState === 'open') {
            dataChannel.send(JSON.stringify(msg)); 
            console.log("right");
        }       
        
        startPingTest();
    }, false);
    
    
    canvas.addEventListener('click', function() {
        if (dataChannel.readyState === 'open') {
            msg = dataChannel.label + "hej";
            dataChannel.send(JSON.stringify(msg)); 
        }       
    }, false);
    if (dataChannel.readyState === 'open') {
            msg = dataChannel.label + "hej";
            dataChannel.send(JSON.stringify(msg)); 
        } 
*/
    //Jump - w
    
    
    if (keys[87]) {
        if(!p1.jumping) {
            p1.jumping = true;
            p1.velY = -p1.speed * 6;
        }
        if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[9], 8);  
        } else {
            p1.animate.change(sprite_sheet.frame_sets[2], 8);  
        } 
    }
    
    
    // Move right - d   
    if (keys[68]) {
        p1.moving("right");
        p1.animate.change(sprite_sheet.frame_sets[1], 12);
        lastDir = "right";
        
        if (keys[87]) {
            if(!p1.jumping) {
                    p1.jumping = true;
                    p1.velY = -p1.speed;
            }
            if(lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);  
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);  
            } 
        }
    }
  
    // Move left - a    
    else if (keys[65]) {
        p1.moving("left");
        p1.animate.change(sprite_sheet.frame_sets[6], 12);
        lastDir = "left";
        
        if (keys[87]) {
            if(!p1.jumping) {
                    p1.jumping = true;
            }
            if(lastDir == "left") {
                p1.animate.change(sprite_sheet.frame_sets[9], 8);  
            } else {
                p1.animate.change(sprite_sheet.frame_sets[2], 8);  
            } 
        }
    } 
    
    // Punch - space
    else if(keys[32]){
        if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[7], 15); 
        } else {
            p1.animate.change(sprite_sheet.frame_sets[4], 15);
        }
            
        punch();
    }
    
   // Block - shift
   else if (keys[16]) {
       if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[8], 15); 
        } else {
            p1.animate.change(sprite_sheet.frame_sets[3], 15);
        }
   }
    
    // Player animation is set to standing frame if no key has been pressed
    else{ 
        if(lastDir == "left") {
            p1.animate.change(sprite_sheet.frame_sets[5], 15);   
        }else {
            p1.animate.change(sprite_sheet.frame_sets[0], 15);
        }    
    }
    
    
    // If player is jumping change player y position and reduce velocity based on gravity
    if(p1.jumping) {
        p1.y += p1.velY;
        p1.velY -= -p1.gravity;
    }
    
    // Check if player is on the ground
    if(p1.y >= p1.startY){
        p1.jumping = false;
        p1.grounded = true;
        p1.velY = 0;
    }
    
    
    // Add borders to canvas
    if(canvas.width * p1.x>= canvas.width * 0.90){    
        if(lastDir == "right") {
            p1.speed = 0 ;
        } else {
            p1.speed = p1.orgSpeed;
        }
    }
    
    if (canvas.width * p1.x <= canvas.width * -0.07) {
       if(lastDir == "left") {
            p1. speed = 0 ;
        } else {
            p1.speed = p1.orgSpeed;
        }
    }
    
    p1.animate.update();
    p2.animate.update();     
}


/* -------------------------------------------------------------------------- */
Game.drawGFX = function() {
    Game.drawWorld();
    //Game.drawPlayers();
    Game.drawUI();
    Game.drawFPS();
};

/* -------------------------------------------------------------------------- */
Game.drawWorld = function() {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height*0.9);
    
    ctx.fillStyle = "#a2a2ff";
    ctx.fillRect(0, canvas.height * 0.0, canvas.width, canvas.height*0.8);
}

/* ----------------------------------------------------------------------- */
Game.drawPlayers = function(player) {
    for(var x = 0; x < players.length; x++) {
        var player = players[x];
            ctx.drawImage(sprite_sheet.image, player.animate.frame * SPRITE_SIZE, 0, 45, 50,
            canvas.width * player.x, canvas.height * player.y, canvas.width * player.width, canvas.height * player.height); 
    }
}

/* --------------------------------------------------------------------- */
Game.drawUI = function(){
    var hp1 = p1.hp/10 * 0.1;
    var hp2 = p2.hp/10 * 0.1;
    
/* ----------------------------------Health bars---------------------------------------- */
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4, canvas.height*0.05);
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4, canvas.height*0.05);
    
    

    if(p1.hp >= 50) {
        ctx.fillStyle = "green";
        
    } else if(p1.hp <= 50 && p2.hp >= 40) {
        ctx.fillStyle = "yellow";
    }
    
    else if(p1.hp < 40) {
        ctx.fillStyle = "red";
    }
    
    if(hp1 >=0 && hp1 <= 100) {
        ctx.fillRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.4 * hp1, canvas.height*0.05);
    }

    if(p2.hp >= 50) {
        ctx.fillStyle = "green";   
    } else if(p2.hp <= 50 && p2.hp >= 40) {
        ctx.fillStyle = "yellow";
    }
    
    else if(p2.hp < 40) {
        ctx.fillStyle = "red";
    }
    
    if(hp2 >=0 && hp2 <= 100) {
        ctx.fillRect(canvas.width * 0.55, canvas.height * 0.05, canvas.width * 0.4 * hp2, canvas.height*0.05);
    }
    
    
/* ---------------------------------- HP text---------------------------------------- */
    ctx.font = (canvas.height * 0.03 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p2.hp,canvas.width * 0.71, canvas.height * 0.14);
    
    ctx.font = (canvas.height * 0.03 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + p1.hp,canvas.width * 0.22, canvas.height * 0.14);
    
    
    
/* ------------------------------------ Player markers-------------------------------------- */
    ctx.font = (canvas.height * 0.05 + "px Arial");
    ctx.fillStyle = "green";
    ctx.fillText("P1", canvas.width * p1.x + (canvas.width * 0.072) , canvas.height * p1.y);
    
    ctx.font = (canvas.height * 0.05 + "px Arial");
    ctx.fillStyle = "black";
    ctx.fillText("P2", canvas.width * p2.x + (canvas.width * 0.072), p2.y + canvas.height * p2.y);
}

/* -------------------------------------------------------------------------- */
Game.drawFPS = function(){
    ctx.font = (0.05 * canvas.height + "px Roboto Condensed");
    ctx.strokeText((1000/frameTime).toFixed(1) + " FPS", canvas.width * 0.005 , canvas.height * 0.04 );
}
var p1 = new Player(0.01, 0.6, 0.15, 0.35, 0.004);
var p2 = new Player(0.01, 0.6, 0.15, 0.35, 0.004);
/* -------------------------------------------------------------------------- */
Game.initialize = function() {
    sprite_sheet.image.src = "img/spritesheet.png";
    canvas = document.getElementById("gamecanvas");
    
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
    }
};

resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
    
window.addEventListener("resize", resize);
/* -------------------------------------------------------------------------- */
Game.update = function(tick) {
    Game.tick = tick; 
    Game.input();
    Game.drawGFX();
    thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
}

/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
Game.pause = function() {
   this.paused = (this.paused) ? false : true;
};

/* -------------------------------------------------------------------------- */
Game.run = (function() {
    var loops = 0;
    var nextGameTick = (new Date).getTime();
    var startTime = (new Date).getTime();
    
    return function() {
        loops = 0;
        while (!Game.paused && (new Date).getTime() > nextGameTick && loops < Game.maxFrameSkip) {
            Game.update(nextGameTick - startTime);
            nextGameTick += Game.skipTicks;
            loops++;
        }
    };
})();

/* -------------------------------------------------------------------------- */
function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 4)) - (shapeB.x + (shapeB.width / 4)),
        vY = (shapeA.y + (shapeA.height / 4)) - (shapeB.y + (shapeB.height / 4)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 4) + (shapeB.width / 4),
        hHeights = (shapeA.height / 4) + (shapeB.height / 4),
        colDir = null;

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {

        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                //shapeA.y += oY;
            } else {
                colDir = "b";
                //shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                //shapeA.x += oX;
            } else {
                colDir = "r";
                //shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

(function() {
    var onEachFrame;
    if (window.requestAnimationFrame) {
       onEachFrame = function(cb) {
          var _cb = function() {
                cb();
             requestAnimationFrame(_cb);
          };
          _cb();
       };
    } else if (window.webkitRequestAnimationFrame) {
       onEachFrame = function(cb) {
          var _cb = function() {
             cb();
             webkitRequestAnimationFrame(_cb);
          };
          _cb();
       };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() {
                cb();
                mozRequestAnimationFrame(_cb);
            };
            _cb();
        };
    } else {
        onEachFrame = function(cb) {
            setInterval(cb, Game.skipTicks);
        };
    }

    window.onEachFrame = onEachFrame;
})();