'use strict';

const co         = require('co');
const AWS        = require('aws-sdk');
const kinesis    = new AWS.Kinesis();
const awscred    = require("awscred");
const chance     = require('chance').Chance();
const streamName = process.env.order_events_stream || 'order-events';


module.exports.handler = co.wrap(function* (event, context, cb) {

  let restaurantName = JSON.parse(event.body).restaurantName;
  
  let userName =  JSON.parse(event.body).userName;

  let orderId = chance.guid();
  console.log(`placing order ID [${orderId}] to [${restaurantName}] from user [${userName}]`);

  let data = {
    orderId,
    userName,
    restaurantName,
    eventType: 'order_placed'
  };

  let putReq = {
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName
  };

  yield kinesis.putRecord(putReq).promise();

  console.log("published 'order_placed' event to kinesis");

  let response = {
    statusCode: 200,
    body: JSON.stringify({orderId})
  };

  cb(null, response);
});

