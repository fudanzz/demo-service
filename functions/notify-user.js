'use strict';

const _          = require('lodash');
const co         = require('co');
const getRecords = require('../lib/kinesis').getRecords;
const AWS        = require('aws-sdk');
const kinesis    = new AWS.Kinesis();
const sns        = new AWS.SNS();

const streamName = process.env.order_events_stream || 'order-events';
const topicArn = process.env.user_notification_topic || 'arn:aws-cn:sns:cn-north-1:834095994034:user-notification';


module.exports.handler = co.wrap(function* (event, context, cb) {
  console.log('receive a event notify-user');

  let records = getRecords(event); 
  let orderAccepted = records.filter(r => r.eventType === 'order_accepted');

  for (let order of orderAccepted) {
    let snsReq = {
      Message: JSON.stringify(order),
      TopicArn: topicArn
    };
    yield sns.publish(snsReq).promise();
    console.log(`notified user [${order.userName}] of order [${order.orderId}]`);

    let data = _.clone(order);
    data.eventType = 'user_notified';

    let kinesisReq = {
      Data: JSON.stringify(data), // the SDK would base64 encode this for us
      PartitionKey: order.orderId,
      StreamName: streamName
    };
    yield kinesis.putRecord(kinesisReq).promise();
    console.log(`published 'user_notified' event to Kinesis`);
  }

  cb(null, "all done");
});

