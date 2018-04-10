$(document).ready(function() {
    var data;
    function generate_data() {
        var x = "1234567890";
        var iterations = 11;
        for (var i = 0; i < iterations; i++) {
            x += x+x;
        } 
        data = x;
    }
    
    generate_data();
    
    localStorage.setItem("data", data);
    /*
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(data));
    element.setAttribute('download', "testData.txt");
    element.click();
    */
});