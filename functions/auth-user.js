'use strict';

const co      = require('co');
const chance  = require('chance').Chance();
const jwt     = require('jsonwebtoken');

module.exports.handler = co.wrap(function* (event, context, cb) {

  let req = JSON.parse(event.body);
  let res = {};

  if(req.username==='demo' && req.password==='demo'){

    let jsonToSign = {
      email: chance.email(),
      name: chance.name()
    }

    let token = jwt.sign(jsonToSign, 'secrect',{ expiresIn: '1h' });
    res = {"token":token};
  }else{
    res = {"msg":"user authentication failed"}
  }
  
  let response = {
    statusCode: 200,
    body: JSON.stringify(res)
  }

  cb(null, response);
});

