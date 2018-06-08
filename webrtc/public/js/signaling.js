var hostButton = document.getElementById("host");
hostButton.addEventListener("click", function () {
    host = sessionId;
    if (hosting == false) {
        hostButton.innerHTML = "You are the host";
        hosting = true;
        createPeerConns();
        createDataChannels();
        generatePlayers();
        startButton.style.display = "block";
    }
})

var startButton = document.getElementById("start");
startButton.addEventListener("click", function () {
    if (starter == false) {
        startButton.style.display = "none";
        send({
            type: "host",
            session: sessionId,
            players: players
        });
    }
});

socket.on('connect', function (data) {
    startButton.style.display = "none";
    console.log("This clients id: " + socket.id);
    sessionId = socket.id;
});

socket.on('users', function (datar) {
    var data = JSON.parse(datar);
    var array = data.users;
    peers.length = 0;

    for (var x = 0; x < array.length; x++) {
        if (sessionId != array[x]) {
            peers.push(array[x]);
        }
    }
});

function generatePlayers() {
    players.length = 0;

    for (var x = 0; x < peers.length; x++) {
        if (players.length % 2 == 0) {
            players.push(new Player(0.1, 0.4, 0.25, 0.55, 0.004, peers[x], "p1", players.length, "right"));
        } else {
            players.push(new Player(0.7, 0.4, 0.25, 0.55, 0.004, peers[x], "p2", players.length, "left"));
        }
    }
    console.log(players);
}

function addPlayers() {
    players.length = 0;
    for (var x = 0; x < recievedPlayers.length; x++) {
        players.push(recievedPlayers[x]);
        if (recievedPlayers[x].pid == sessionId) {
            player = recievedPlayers[x];
        }

        if (animations.length < players.length) {
            animations.push(new Animation());
        }
    }
}

socket.on('message', function (message) {
    var data = JSON.parse(message);
    switch (data.type) {
        case "host":
            if (sessionId != data.host) {
                hostId = data.host;
                setupConn();
                hideTestElements();
                if (!test) {
                    runGame();
                    recievedPlayers = data.players;
                    addPlayers();
                }
            }
            break;
        case "offer":
            if (host) {
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

function createDataChannels() {
    for (var x = 0; x < peerConnections.length; x++) {
        dataChannels.push(peerConnections[x].createDataChannel("channel" + [x], dataChannelOptions));
    }
    for (var x = 0; x < dataChannels.length; x++) {
        dataChannels[x].onopen = dataChannelStateChanged;
        dataChannels[x].ondatachannel = receiveDataChannel;
    }
}

function createPeerConns() {
    if (hosting == true && host == sessionId) {
        for (var x = 0; x < peers.length; x++) {
            peerConnections.push(new RTCPeerConnection(config, null));
            if (x < peers.length) {
                start = false;
            }
        }
    }
}

function setupConn() {
    if (!host) {
        peerConn = new RTCPeerConnection(config, null);
        dataChannel = peerConn.createDataChannel('textMessages', dataChannelOptions);
        dataChannel.onopen = dataChannelStateChanged;
        peerConn.ondatachannel = receiveDataChannel;
        peerConn.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: event.candidate,
                    session: hostId,
                    peer: sessionId
                });
            }
        };

        peerConn.createOffer(function (offer) {
            send({
                type: "offer",
                offer: offer,
                session: hostId,
                peer: sessionId
            });
            peerConn.setLocalDescription(offer);
        }, function (error) {});
    }
}

function createAnswer(index, peerId) {
    peerConnections[index].createAnswer(function (answer) {
        peerConnections[index].setLocalDescription(answer);
        send({
            type: "answer",
            answer: answer,
            session: peerId
        });
    }, function (error) {
        alert("oops...error");
    });
}

//when somebody wants to call us 
function onOffer(offer, peerId) {
    if (host) {
        for (var x = 0; x < peers.length; x++) {
            if (peerId == peers[x]) {
                peerConnections[x].setRemoteDescription(new RTCSessionDescription(offer), function () {}, console.error.bind(console));
                createAnswer(x, peerId);
            }
        }
    } else {
        peerConn.setRemoteDescription(new RTCSessionDescription(offer), function () {}, console.error.bind(console));

        peerConn.createAnswer(function (answer) {
            peerConn.setLocalDescription(answer);
            send({
                type: "answer",
                answer: answer,
                session: hostId,
                index: index
            });
        }, function (error) {
            alert("oops...error");
        });
    }
}

//when another user answers to our offer 
function onAnswer(answer, index) {
    peerConn.setRemoteDescription(new RTCSessionDescription(answer), function () {}, console.error.bind(console));
}

function send(message) {
    socket.emit("message", (JSON.stringify(message)));
    console.log("sending to server," + JSON.stringify(message));
}

//when we got ice candidate from another user 
function onCandidate(candidate, peerId) {
    if (host) {
        for (var x = 0; x < peers.length; x++) {
            if (peerId == peers[x]) {
                peerConnections[x].addIceCandidate(new RTCIceCandidate(candidate));
                console.log(peerConnections);
            }
        }
    } else {
        peerConn.addIceCandidate(new RTCIceCandidate(candidate));
    }
}
