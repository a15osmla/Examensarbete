var socket = io.connect();
var peerConn;
var config = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};




// båda klienterna tar emot sdp
// klient 1 skickar sdp till klient 2
// klient 2 tar emot från 1, svarar till 2 med sin sdp
// anslu

var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;

socket.on('connect', function() {
  console.log(socket.id);
});

socket.on("start connection", function(data) {
    
    socket.on('signaling_message', function(data) {
	displaySignalMessage("Signal received: " + data.type);
	//Setup the RTC Peer Connection object
	if (!rtcPeerConn)
		startSignaling();
	
	if (data.type != "user_here") {
		var message = JSON.parse(data.message);
		if (message.sdp) {
			rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
				// if we received an offer, we need to answer
				if (rtcPeerConn.remoteDescription.type == 'offer') {
					rtcPeerConn.createAnswer(sendLocalDesc, logError);
				}
			}, logError);
		}
		else {
			rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
		}
	}
	
        
        

    peerConn = new RTCPeerConnection(config, null);
    dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);
          
    // send any ice candidates to the other peer
    peerConn.onicecandidate = function (evt) {
        if(evt.candidate) {
            socket.emit("send candidate", JSON.stringify({ "candidate": evt.candidate }));
            displaySignalMessage("Successfully sent candidate");
        }
            
    rtcPeerConn.onnegotiationneeded = function () {
		  displaySignalMessage("on negotiation called");
		   rtcPeerConn.createOffer(sendLocalDesc, logError);
    }  
           
    };
        
});


    
    
    

function sendLocalDesc(desc) {
    rtcPeerConn.setLocalDescription(desc, function () {
		displaySignalMessage("sending local description");
		io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription })});
	}, logError);
    
}

//Logging/Display Methods
function logError(error) {
	displaySignalMessage(error.name + ': ' + error.message);
}

function displaySignalMessage(message) {
	document.getElementById("game").innerHTML = document.getElementById("game").innerHTML + "<br/>" + message;
}