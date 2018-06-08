var textFile = null;
var pingTest = false;
var create = document.getElementById('create');
var link = document.getElementById('downloadlink');
var dataTest = false;
var testButton = document.getElementById("test");
var serverTesting = false;
var messages = 0;
var passes = 0;
var testStarter = false;
var test = false;;

if (test == true) {
    var controls = document.getElementsByClassName("controller");
    for (var i = 0; i < controls.length; i++) {
        controls[i].style.display = 'none';
    }
} else {
    document.getElementById("logger").style.display = "none";
    document.getElementById("test").style.display = "none";
    document.getElementById("create").style.display = "none";
    document.getElementById("downloadlink").style.display = "none";
}

makeTextFile = function (text) {
    var data = new Blob([text], {
        type: 'text/plain'
    });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
};

create.addEventListener('click', function () {
    link.href = makeTextFile(logger.value);
    link.style.display = 'block';
});

// Peer 
function startPingTest() {
    if (!pingTest) {
        pingTest = true;
        var interval = setInterval(function () {
            var msg = {
                type: "ping",
                ping: Date.now()
            };
            dataChannel.send(JSON.stringify(msg));
        }, 1000 / 30);
    }
}

testButton.addEventListener("click", function () {
    if (testStarter == false) {
        startButton.style.display = "none";
        sendTests();
    }
});

function sendTests() {
    if (!testing) {
        testing = true;
        var msg = {
            type: "pingTest"
        }
        dataChannels[0].send(JSON.stringify(msg));
    }
}

/*
function startDataTest() {
    if (!dataTest) {
        dataTest = true;
        var interval = setInterval(function () {
            var msg = {
                type: "sendDataTest",
                test: testdata
            };
            dataChannel.send(JSON.stringify(msg));
        }, 1000 / 30);
    }
}*/