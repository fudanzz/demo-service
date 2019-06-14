'use strict';

const APP_ROOT = '../../';

const _       = require('lodash');
const co      = require('co');
const Promise = require("bluebird");
const http    = require('superagent-promise')(require('superagent'), Promise);


let respondFrom = function (httpRes) {
  let contentType = _.get(httpRes, 'headers.content-type', 'application/json');
  let body = 
    contentType === 'application/json'
      ? httpRes.body
      : httpRes.text;

  return { 
    statusCode: httpRes.status,
    body: body,
    headers: httpRes.headers
  };
}

let signHttpRequest = (url, httpReq) => {
  let urlData = URL.parse(url);
  let opts = {
    host: urlData.hostname, 
    path: urlData.pathname
  };

  aws4.sign(opts);

  httpReq
    .set('Host', opts.headers['Host'])
    .set('X-Amz-Date', opts.headers['X-Amz-Date'])
    .set('Authorization', opts.headers['Authorization']);

  if (opts.headers['X-Amz-Security-Token']) {
    httpReq.set('X-Amz-Security-Token', opts.headers['X-Amz-Security-Token']);
  }
}

let viaHttp = co.wrap(function* (relPath, method, opts) {
  let root = process.env.TEST_ROOT;
  let url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  try {
    let httpReq = http(method, url);

    let body = _.get(opts, "body");
    if (body) {      
      httpReq.send(body);
    }

    if (_.get(opts, "iam_auth", false) === true) {
      signHttpRequest(url, httpReq);
    }

    let authHeader = _.get(opts, "auth");
    if (authHeader) {
      httpReq.set('Authorization', authHeader);
    }
    
    let res = yield httpReq;
    return respondFrom(res);
  } catch (err) {
    if (err.status) {
      return {
        statusCode: err.status,
        headers: err.response.headers
      };
    } else {
      throw err;
    }
  }
})

let we_invoke_get_pets = co.wrap(function* () {
  let res = yield viaHttp('pets', 'GET');
  return res;
});

let we_invoke_hello_world = co.wrap(function* () {
  let res = yield viaHttp('hello', 'GET');
  return res;
});

let we_invoke_get_restaurants = co.wrap(function* () {
  let res = yield viaHttp('restaurants', 'GET');
  return res;
});

module.exports = {
  we_invoke_hello_world,
  we_invoke_get_restaurants,
  we_invoke_get_pets
};