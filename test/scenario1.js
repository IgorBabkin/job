"use strict";

var Job = require('../lib/job').Job;
var expect = require('expect.js');

describe('Scenario 1', function () {
   it('should be done with first attempt', function (done) {
       var isStartCalled = false;
       var isStopCalled = false;
       var executeCallsCount = 0;
       var isRetryCalled = false;
       var isErrorCalled = false;
       var job = new Job(function () {
           return new Promise(function (resolve) {
               setTimeout(resolve.bind(null, 'yo'), 500);
           });
       }, 100);

       job.on('start', function () {
           isStartCalled = true;
       });

       job.on('stop', function () {
           isStopCalled = true;
       });

       job.on('execute', function () {
           executeCallsCount++;
       });

       job.on('retry', function () {
           isRetryCalled = true;
       });

       job.on('error', function () {
           isErrorCalled = true;
       });

       job.on('done', function (msg) {
           try {
               expect(isStartCalled).to.be.ok();
               expect(isStopCalled).to.not.be.ok();
               expect(isRetryCalled).to.not.be.ok();
               expect(isErrorCalled).to.not.be.ok();
               expect(executeCallsCount).to.be(1);
               expect(msg).to.equal('yo');
               done();
           } catch (err) {
               done(err);
           }
       });

       job.start();
   });
});