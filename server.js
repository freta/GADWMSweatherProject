var express = require('express');
var app = express();
// setting port
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));
//routes
app.get('/', function (req, res) {
  res.render('index');
});
app.listen(port, function () {
  console.log('Our app is running');
});
