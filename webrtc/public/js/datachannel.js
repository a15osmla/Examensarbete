var socket = io.connect();
var peerConn;
var config = {
	'iceServers': [{'url': 'stun:stun.1und1.de'}
                  ]
};

var storage = localStorage.setItem("ms", " ");

var dataChannelOptions = {
	ordered: true, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;
var sessionId;
var otherId;

socket.on('connect', function(data) {
    console.log("This clients id: " + socket.id);
    sessionId = socket.id;
    
    
    socket.on('users', function(data) {
        var array = data.users;
        for(var x = 0; x < array.length; x++) {
            if(sessionId != array[x]) {
               otherId = array[x];
            }
        }
    });
 
    
    peerConn = new RTCPeerConnection(config, null);
    dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);  
    
    dataChannel.onopen = dataChannelStateChanged;
    peerConn.ondatachannel = receiveDataChannel;
    
    displaySignalMessage("RTCPeerConnection object was created");
      
    
    socket.on('connectedfirst', function(data){ 
        peerConn.onicecandidate = function (event) { 
        if (event.candidate) { 
            send({ 
               type: "candidate", 
               candidate: event.candidate, 
               session:otherId
            });
         } 
        }; 
       
        
        if(data == sessionId) {
          peerConn.createOffer(function (offer) { 
            displaySignalMessage("create offer");
             send({ type: "offer", offer: offer, session: otherId}); 
             peerConn.setLocalDescription(offer); 
          }, function (error) { 
             displaySignalMessage("erorr");
          }); 
        }
        
    }); 
});


//Data Channel Specific methods
function dataChannelStateChanged(event) {
	if (dataChannel.readyState === 'open') {
        socket.disconnect();
        displaySignalMessage("Data Channel open");
		dataChannel.onmessage = receiveDataChannelMessage;
        setInterval(function(){ 
            var s = new Date();
            dataChannel.send(s);                  
        }, 1000/60);
	}
}


function receiveDataChannelMessage(event) {
    var s = event.data;
    var ms =  new Date - s;
    
    var old = localStorage.getItem("ms");
    var news = old + ms + (\n);
    localStorage.setItem("ms", news);
    console.log(ms);
}

function receiveDataChannel(event) {
	displaySignalMessage("Receiving a data channel");
	dataChannel = event.channel;
	dataChannel.onmessage = receiveDataChannelMessage;
}


socket.on('message', function(message) {
    var data = JSON.parse(message); 
    switch(data.type) { 
      case "offer": 
        displaySignalMessage("Offer received");
         onOffer(data.offer, data.session); 
         break; 
      case "answer":
         displaySignalMessage("answer received");
        
         onAnswer(data.answer); 
         break; 
      case "candidate":
        displaySignalMessage("candidate received");
         onCandidate(data.candidate); 
         break; 
      default: 
         break; 
   } 
});

//when somebody wants to call us 
function onOffer(offer, sessionId) { 
  console.log(offer);
   connectedUser = name; 
   peerConn.setRemoteDescription(new RTCSessionDescription(offer), function() {
       console.log(peerConn);
   },  console.error.bind(console));
	
  peerConn.createAnswer(function (answer) { 
      peerConn.setLocalDescription(answer); 
		
      send({ 
         type: "answer", 
         answer: answer,
         session: otherId
      }); 
		
   }, function (error) { 
      alert("oops...error"); 
   }); 
}

//when another user answers to our offer 
function onAnswer(answer) {
    peerConn.setRemoteDescription(new RTCSessionDescription(answer), function() {
       console.log(peerConn);
   },  console.error.bind(console));
}

function send(message) {
    //socket.emit("message", message);
    socket.emit("message", (JSON.stringify(message)));
    displaySignalMessage("sending to server" + message);
    console.log("sending to server," +  JSON.stringify(message));
}

//when we got ice candidate from another user 
function onCandidate(candidate) { 
   peerConn.addIceCandidate(new RTCIceCandidate(candidate));
    console.log(peerConn);
}


function displaySignalMessage(message) {
};

//creating data channel 
function openDataChannel() { 

   var dataChannelOptions = { 
      reliable:false
   }; 
	
    dataChannel = peerConn.createDataChannel("myDataChannel", dataChannelOptions);
    
    dataChannel.onopen = function(event) {
      dataChannel.send("Hi there1");
    };
    
   dataChannel.onerror = function (error) { 
      console.log("Error:", error); 
   };
    
    dataChannel.send("ssd");
	
   dataChannel.onmessage = function (event) { 
      console.log("Got message:", event.data); 
   };
    
    
}