var socket = io.connect();
var peerConn;
var config = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302',
        'url' :'stun:stun.2.google.com:19302',
        'url' :'stun:stun.3.google.com:19302',
        'url' :'stun:stun.4.google.com:19302',
        'url' :'stun:stun.4.google.com:19302',
        'url' :'stun:stun.4.google.com:19302',
        'url' :'stun:stun01.sipphone.com',
        
	}]
};

var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;
var sessionId;

socket.on('connect', function(data) {
    console.log("This clients id: " + socket.id);
    sessionId = socket.id;
    
    peerConn = new webkitRTCPeerConnection(config, { 
         optional: [{RtpDataChannels: true}] 
    });
    
     peerConn.onicecandidate = function (event) { 
		
         if (event.candidate) { 
            send({ 
               type: "candidate", 
               candidate: event.candidate, 
                session:sessionId
            });
         } 
      }; 
    
    console.log("RTCPeerConnection object was created"); 
    console.log(peerConn);
    displaySignalMessage("RTCPeerConnection object was created");
    
    socket.on('connectedfirst', function(data){
        
      
        
        if(data == sessionId) {
          peerConn.createOffer(function (offer) { 
            displaySignalMessage("create offer");
             send({ type: "offer", offer: offer, session: sessionId}); 
             peerConn.setLocalDescription(offer); 
          }, function (error) { 
             displaySignalMessage("erorr");
          }); 
        }
        
    }); 
});




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
   connectedUser = name; 
   peerConn.setRemoteDescription(new RTCSessionDescription(offer));
	
  peerConn.createAnswer(function (answer) { 
      peerConn.setLocalDescription(answer); 
		
      send({ 
         type: "answer", 
         answer: answer,
         session: sessionId
      }); 
		
   }, function (error) { 
      alert("oops...error"); 
   }); 
}

//when another user answers to our offer 
function onAnswer(answer) { 
   peerConn.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(peerConn);
}

function send(message) {
    //socket.emit("message", message);
    socket.emit("message", (JSON.stringify(message)));
    displaySignalMessage("sending to server" + message);
    console.log("sending to server," +  message);
}
    

//when we got ice candidate from another user 
function onCandidate(candidate) { 
   peerConn.addIceCandidate(new RTCIceCandidate(candidate)); 
}

function displaySignalMessage(message) {
	document.getElementById("game").innerHTML = document.getElementById("game").innerHTML + "<br/>" + message;
};  