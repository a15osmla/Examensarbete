var testData, serverData, testing;
var logger = document.getElementById("logger");
var create = document.getElementById('create');
var link = document.getElementById('downloadlink');
var testButton = document.getElementById("test");
var textFile = null;
var messages = 0;
var passes = 0;


var starter = false;

testData, serverData = "ertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertrrtqwertqrtqwertqwertqwertqwertqwertqwertrrtqwertqrtqwertqwertqwertrrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwertrtqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwerttqwertqwertqwertqwertqwertqwertqwertqwertqwertqwertqqwertqwertwertqwertqwertqwertqqwertqwertqwertqwertwertqwertqwertqwertqwert";


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

function startTest() {
    if (!testing) {
        testing = true;
        var interval = setInterval(function () {
            var msg = {
                action: 'ping',
                start: Date.now(),
                id: sessionId
            };
            socket.emit('message', JSON.stringify(msg));
        }, 1000 / 30);
    }
}

testButton.addEventListener("click", function () {
    if (starter == false) {
        starter = true;
        testButton.style.display = "none";
        startTest();
    }
});
var phone = false;
socket.on("pong", function (dataz) {
    var parsedData = JSON.parse(dataz);
    var e = Date.now();
    var ms = (e - parsedData.start);

    if (isNaN(ms) == false) {
        if (phone == true) {
            logger.append(ms + "\n");
            messages = messages + 1;
            if (messages > 800) {
                link.setAttribute("download", passes + ".txt");
                create.click();
                link.click();
                logger.innerHTML = "";
                messages = 0;
                passes = passes + 1;
            }
        } else {
            setTimeout(console.log.bind(console, ms));
        }

    }
});


/*
var dataTest = false;

function startDataTest() {
    if (!dataTest) {
        dataTest = true;
        var interval = setInterval(function () {
            var msg = {
                action: "serverData",
                test: testData
            };
            socket.emit('message', JSON.stringify(msg));
        }, 1000 / 30);
    }
}

function sendDataTest() {
    var msg = {
        action: "sendDataTest"
    };
    socket.emit("message", JSON.stringify(msg));
}

socket.on("dataTest", function (dataz) {
    startDataTest();
    console.log("datatest");
});

socket.on("testdata", function (dataz) {
    var parsedData = JSON.parse(dataz);
});

socket.on("test", function (datas) {
    var data = JSON.parse(datas);
    var s = data.start;
    var n = Date.now();
    var ms = n - s;

    console.log("s: " + s + " n: " + n);
    console.log(ms);

    
    var old = localStorage.getItem("ms");
    var news = old + ms + "\n";
    localStorage.setItem("ms", news);
    
});


socket.on("ping", function(dataz) {
    console.log("ping");
    var parsedData = JSON.parse(dataz);
    //var msg = {action:"pong", start: parsedData.start, testdata: parsedData.testdata, idd:otherId};
    var msg = {action:"pong", start: parsedData.start, id:parsedData.id};
    socket.emit("message", JSON.stringify(msg));
});
*/
