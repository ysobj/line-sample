'use strict';

var PORT_NUMBER = 3000;

var express = require('express');
var logger = require('morgan');
var responseTime = require('response-time');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var line = require('./routes/line');

var app = express();

app.use(logger('dev'));
app.use(responseTime());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(errorHandler());
app.use('/api', line);

app.listen(PORT_NUMBER, function(){
  console.log("Exaple app is listening at port number %s", PORT_NUMBER);
});
