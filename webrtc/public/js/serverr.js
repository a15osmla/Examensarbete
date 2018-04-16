
app.get('/', function(req, res){
	res.render('index.ejs');
});

app.listen(process.env.PORT || PORT);

app.io.route('ready', function(req) {
	req.io.join(req.data.signal_room);
})

app.io.route('signal', function(req) {
	//Note the use of req here for broadcasting so only the sender doesn't receive their own messages
	req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
		message: req.data.message
    });