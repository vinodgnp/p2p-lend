// web.js
var express = require("express");
var logfmt = require("logfmt");
var path = require('path');

var app = express();

//app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(express.methodOverride());
app.use(logfmt.requestLogger());

app.use(express.static(__dirname + '/public'));


require('./mongoose');
require('./routes')(app);

var port = process.env.PORT || 5001;
app.listen(port, function() {
  console.log("Listening on " + port);
});



