var socket = io.connect();
var peerConn;
var config = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};

var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;
var sessionId;

socket.on('connect', function() {
  console.log("This clients id: " + socket.id);
    sessionId = socket.id;
});

socket.on('signaling_message', function(data) {
   
    if(data.session != sessionId) {
        console.log("Recieved id: " + data.session);
            displaySignalMessage("Signal received: " + data.type);
            var message = JSON.parse(data.message);
            console.log(message);
                
                if (message.sdp) {
                    peerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
                      
                        // if we received an offer, we need to answer
                        if (peerConn.remoteDescription.type == 'offer') {
                            displaySignalMessage("Answered");
                            peerConn.createAnswer(sendLocalDesc, logError);
                        }
                        
                    }, logError);
                }
                else {
                    peerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
                }
        
        
        }
          
	});
    

peerConn = new RTCPeerConnection(config, null);
dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);
    
dataChannel.onopen = dataChannelStateChanged;
peerConn.ondatachannel = receiveDataChannel;
 
          
// send ice candidates to the other peer
peerConn.onicecandidate = function (evt) {
    if(evt.candidate) {
        socket.emit('signal',{"session":socket.id, "type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate })});
        displaySignalMessage("Successfully sent candidate");
    }      
};

    
peerConn.onnegotiationneeded = function () {
    displaySignalMessage("on negotiation called");
    peerConn.createOffer(sendLocalDesc, logError);
}    
    



function sendLocalDesc(desc) {
    peerConn.setLocalDescription(desc, function () {
		displaySignalMessage("sending local description");
		socket.emit('signal', {"session":socket.id, "type":"SDP", "message": JSON.stringify({ 'sdp': peerConn.localDescription }) });
	}, logError);    
}


//Logging/Display Methods
function logError(error) {
	displaySignalMessage(error.name + ': ' + error.message);
}


function displaySignalMessage(message) {
	document.getElementById("game").innerHTML = document.getElementById("game").innerHTML + "<br/>" + message;
};  

