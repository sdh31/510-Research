var express = require('express');
var basic_db_utility = require('./basic_db_utility')
var app = express();
var mysql      = require('mysql');
app.engine('html', require('ejs').renderFile);

// req.query has field, table and start_time
app.get('/data', function (req, res) {

  var callback = function(result) {
    if (result.error) {
      res.status(400).json(result);
    } else {
      timeStamps = [];
      values = [];
      for (var i = 0; i<result.results.length; i++) {
        timeStamps.push(result.results[i].timeStamp);
        values.push(result.results[i][req.query.field]);
      }
      res.status(200).json({timeStamps: timeStamps, values: values});
    }
  };

  var query = "SELECT timeStamp," + req.query.field + " FROM " + req.query.table + " where timestamp > " + req.query.start_time;

  basic_db_utility.performMultipleRowDBOperation(query, callback);
});

app.get('/', function (req, res) {
  res.render('/Users/rahulswaminathan/BigData/510-Research/index.html');
});

app.get('/chartDemo.js', function (req, res) {
  res.sendFile('/Users/rahulswaminathan/BigData/510-Research/chartDemo.js');
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});

process.on('uncaughtException', function (err) {
    console.log(err);
});