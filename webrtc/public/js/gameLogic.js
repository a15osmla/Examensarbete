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