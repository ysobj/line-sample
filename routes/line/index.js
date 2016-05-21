'use strict'
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var axios = require('axios');
var global = require('../../env.json');
var bodyParser = require('body-parser');
var line;

mongodb.MongoClient.connect('mongodb://localhost:27017/expsample',function(err,db){
  line = db.collection('line');
});

router.route('/line').get(function(req,res,next){
  console.log(req);
  console.log(req.query.contents);
  console.log(req.query.test);
  line.find().toArray(function(err,list){
    res.json(list);
  });
})
.post(bodyParser.json(),function(req,res,next){
  console.log(req.body);
  var result = req.body.result;
  if(result == null){
    result = [];
  }
  var from = '';
  var text = '';
  result.forEach(function(tmp){
    var x = tmp.content.from;
    from = x;
    text = tmp.content.text;
    x = x + " : ";
    x += tmp.content.text;
    line.insert({
      contents: x,
      userId: 1,
      regDate: new Date()
    });
  });
  var createMessage = function(text){
    if(text === 'image'){
      return {
        "to" : [from],
        "toChannel":1383378250,
        "eventType":"138311608800106203",
        "content":{
          "toType":1,
          "contentType":2,
          "originalContentUrl": "https://ysobj.me/punxuvbz.jpg",
          "previewImageUrl": "https://ysobj.me/punxuvbz_small.jpg"
        }
      }
    }else if(text === 'location'){
      return {
        "to" : [from],
        "toChannel":1383378250,
        "eventType":"138311608800106203",
        "content":{
          "toType":1,
          "contentType":7,
          "text": "北京師大二附中",
          "location": {
            "title": "北京師大二附中",
            "latitude": 39.96018,
            "longitude": 116.37182
          }
        }
      }
    }else{
      return {
        "to" : [from],
        "toChannel":1383378250,
        "eventType":"138311608800106203",
        "content":{
          "toType":1,
          "contentType":1,
          "text": text
        }
      }
    }
  };
  var headers = {};
  headers['Content-Type'] = 'application/json';
  headers['X-Line-ChannelID'] = global.channelId;
  headers['X-Line-ChannelSecret'] = global.channelSecret;
  headers['X-Line-Trusted-User-With-ACL'] = global.mid;
  axios.post('https://trialbot-api.line.me/v1/events',
      createMessage(text),
      {
        headers:headers
      });
  //console.log(createMessage(text));
  res.status(201).json();
});


module.exports = router;
