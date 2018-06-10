//----------------------------------------------- Datachannels -------------------------------------------------------

//Data Channel Specific methods
function dataChannelStateChanged(event) {
    var channelLabel = event.currentTarget.label;
    if (host) {
        for (var x = 0; x < dataChannels.length; x++) {
            if (dataChannels[x].readyState === 'open') {
                dataChannels[x].onmessage = receiveDataChannelMessage;
            }
        }
    } else {
        if (dataChannel.readyState === 'open') {
            dataChannel.onmessage = receiveDataChannelMessage;
        }
    }
}

function receiveDataChannel(event) {
    if (host) {
        for (var x = 0; x < dataChannels.length; x++) {
            dataChannels[x] = event.channel;
            console.log(dataChannel[x]);
        }
        dataChannels[x].onmessage = receiveDataChannelMessage;
        dataChannels[x].send("player");
    } else {
        dataChannel = event.channel;
        dataChannel.onmessage = receiveDataChannelMessage;
    }
}

function sendToAllPeers(data) {
    for (var x = 0; x < dataChannels.length; x++) {
        setTimeout(console.log.bind(console, "Send to all peers \n"));
        dataChannels[x].send(JSON.stringify(data));
    }
}

function pingAllPeers(data) {
    for (var x = 0; x < dataChannels.length; x++) {
        setTimeout(console.log.bind(console, "Send to all peers \n" + data));
        if (x != 0) {
            dataChannels[x].send(JSON.stringify(data));
        }
    }
}

function receiveDataChannelMessage(event) {
    socket.disconnect();
    var parsedData = JSON.parse(event.data);

    // --------------------------      Ping channel 1     -------------------------------------

    if (parsedData.type == "pingTest") {
        startPingTest();
    }

    if (parsedData.type == "ping") {
        var msg = {
            type: "serverData",
            data: serverData
        };
        sendToAllPeers(msg);

        var msg2 = {
            type: "pong",
            ping: parsedData.ping
        };
        dataChannels[0].send(JSON.stringify(msg2));
    }

    if (parsedData.type == "pong") {
        var pongTime = Date.now();
        pingTime = parsedData.ping;
        var ms = (pongTime - pingTime);
        var phone = false;
        if(phone){
            var logger = document.getElementById("logger");
            logger.append(ms + "\n");
            messages = messages + 1;
            if (messages >= 800) {
                link.setAttribute("download", passes + ".txt");
                create.click();
                link.click();
                logger.innerHTML = "";
                messages = 0;
                passes = passes + 1;
            }
        } else {
            setTimeout (console.log.bind (console, ms));
        }
    }
        
    if (parsedData.type == "dataTest") {
        startDataTest();
    }

    // -------------------------- Handle player input -------------------------------------
    if (parsedData.type == "input") {
        lastDir = parsedData.dir;
        index = parsedData.index;
        player = players[index];
        var canvas = parsedData.canvas;
        var cCheck;
        var cCheck2;
        var player2;

        switch (parsedData.action) {
            case "block":
                player.blocking = true;
                player.action = "block";
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
                break;
            case "punch":
                player.blocking = false;
                player.action = "punch";
                for (var x = 0; x < players.length; x++) {
                    if (index != players[x].index) {
                        player2 = players[x];
                    }
                }

                if (player2) {
                    cCheck = colCheck(player, player2);
                    console.log(cCheck);

                    if (cCheck == "l" || cCheck == "r") {
                        if (player.dir == "right" && player2.dir == "left") {
                            if (!player2.blocking) {
                                player2.hp += -5;
                            }
                        } else if (player2.dir == "left" && player.dir == "right") {
                            if (!player2.blocking) {
                                player2.hp += -5;
                            }
                        } else if (player.dir == "right" && player.dir == "right") {
                            player2.hp += -5;
                        } else {
                            player2.hp += -5;
                        }
                    }
                }
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
                break;
            case "left":
                player.blocking = "false";
                player.x -= player.speed;
                player.dir = lastDir;
                player.action = "left";
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
                break;
            case "right":
                player.blocking = "false";
                player.x += player.speed;
                player.dir = lastDir;
                player.action = "right";
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);

                break;
            case "jump":
                var interval = setInterval(function () {
                    console.log(player.index + " " + player.y);
                    if (!player.jumping && player.grounded) {
                        player.jumping = true;
                        player.grounded = false;
                        player.velY = -player.speed * 6;
                        player.action = "jump";
                    }

                    if (player.jumping) {
                        player.y += player.velY;
                        player.velY -= -player.gravity;
                    }

                    // Check if player is on the ground
                    if (player.y >= player.startY) {
                        player.jumping = false;
                        player.grounded = true;
                        player.velY = 0;
                        clearInterval(interval);
                        player.action = "idle";
                    }
                    msg = {
                        type: "recieveUpdate",
                        players: players
                    };
                    sendToAllPeers(msg);
                    player.blocking = "false";
                }, 16);
                break;
            case "idle":
                player.action = "idle";
                player.blocking = "false";

                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
                break;
        }

        if (canvas) {
            if (canvas * player.x >= canvas * 0.90) {
                if (lastDir == "right") {
                    player.speed = 0;
                } else {
                    player.speed = player.orgSpeed;
                }
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
            }

            if (canvas * player.x <= canvas * -0.07) {
                if (lastDir == "left") {
                    player.speed = 0;
                } else {
                    player.speed = player.orgSpeed;
                }
                msg = {
                    type: "recieveUpdate",
                    players: players
                };
                sendToAllPeers(msg);
            }
        }
    }

    if (parsedData.type == "recieveUpdate") {
        lastRecievedUpdate = Date.now();
        recievedPlayers.length = 0;
        recievedPlayers = parsedData.players;
        addPlayers();
    }
}
