var express = require('express');
var basic_db_utility = require('./basic_db_utility')
var app = express();


app.get('/what', function (req, res) {

  var callback = function(result) {
    console.log(result);
    if (result.error) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  };
  basic_db_utility.performMultipleRowDBOperation("SELECT * FROM a_;", callback);
});

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
  res.render('/Users/stephenhughes/Dropbox/Duke/SeniorDuke/510-Research/index.html');
});

app.get('/chartDemo.js', function (req, res) {
  res.sendFile('/Users/stephenhughes/Dropbox/Duke/SeniorDuke/510-Research/chartDemo.js');
});

app.listen(4000, function () {
  console.log('Example app listening on port 80!');
});