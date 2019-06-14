'use strict';

const co      = require('co');
const Promise = require("bluebird");
const http    = require('superagent-promise')(require('superagent'), Promise);

const pets_url = process.env.pets_url || 'https://dog.ceo/api/breeds/image/random';

function* getPets() {


  let resp = yield dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.handler = co.wrap(function* (event, context, cb) {
  let pets = yield getPets();

  let response = {
    statusCode: 200,
    body: JSON.stringify(pets)
  }

  cb(null, response);
});

