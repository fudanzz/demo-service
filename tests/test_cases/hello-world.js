'use strict';

const co = require('co');
const expect = require('chai').expect;   
const init = require('../steps/init').init;
const when = require('../steps/when');

describe(`When we invoke the GET /hello `, co.wrap(function* () {
  before(co.wrap(function* () {
    yield init();
  }));

  it(`Should return message hello world`, co.wrap(function* () {
    let res = yield when.we_invoke_hello_world();

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message').to.equal('Hello World');

  }));
}));