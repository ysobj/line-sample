'use strict'
var express = require('express');
var router = express.Router();
var axios = require('axios');
var global = require('../../env.json');

router.route('/mail').post(function(req,res,next){
  var createMessage = function(text){
    return {
      "to" : [global.me],
      "toChannel":1383378250,
      "eventType":"138311608800106203",
      "content":{
        "toType":1,
        "contentType":1,
        "text": text
      }
    }
  };
  var headers = {};
  headers['Content-Type'] = 'application/json';
  headers['X-Line-ChannelID'] = global.channelId;
  headers['X-Line-ChannelSecret'] = global.channelSecret;
  headers['X-Line-Trusted-User-With-ACL'] = global.mid;
  //var message = createMessage("fixed");
  var message = createMessage(req.body.text);
  axios.post('https://trialbot-api.line.me/v1/events',
      message,
      {
        headers:headers
      });
  //console.log(req.body);
  console.log(message);
  res.status(201).json();
});

module.exports = router;
