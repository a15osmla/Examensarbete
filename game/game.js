var ctx, width, height;

function start() {
    console.log("start");
    width = $(window).width();
    height =  $(window).height();
    var canvas = document.getElementById("gamecanvas");
    
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}