'use strict';

const chance  = require('chance').Chance();
const jwt     = require('jsonwebtoken');

module.exports.handler = function(event, context, cb) {

  console.log(`request body is valid JSON`, { requestBody: event });
  //verify token
  let effect = 'allow';
  try {
    let decoded = jwt.verify(event.authorizationToken, 'secrect');
  } catch(err) {
    console.log('JWT token invalid');
    return cb('Unauthorized');
    //effect = 'deny';
  }

  let policy =  buildPolicy('user',effect,event.methodArn);
  
  cb(null, policy);
   
};

function buildPolicy(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    var policyDocument = {
      Version: '2012-10-17', // default version
      Statement: [
        {
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

