'use strict';

const co         = require('co');
const AWS        = require('aws-sdk');
const kinesis    = new AWS.Kinesis();
const awscred    = require("awscred");
const streamName = process.env.order_events_stream || 'order-events';

module.exports.handler = co.wrap(function* (event, context, cb) {

  let body = JSON.parse(event.body);

  let restaurantName = body.restaurantName;
  
  let userName =  body.userName;

  let orderId = body.orderId;
  
  console.log(`restautant [${restaurantName}]  accpet order ID [${orderId}] to from user [${userName}]`);

  let data = {
    orderId,
    userName,
    restaurantName,
    eventType: 'order_accepted'
  };

  let putReq = {
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName
  };

  yield kinesis.putRecord(putReq).promise();

  console.log("published 'order_accepted' event to kinesis");

  let response = {
    statusCode: 200,
    body: JSON.stringify({orderId})
  };

  cb(null, response);
});

