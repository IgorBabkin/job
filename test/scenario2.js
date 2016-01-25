"use strict";

var Job = require('../lib/job').Job;
var expect = require('expect.js');

describe('Scenario 2', function () {
    it('should be done with 3th attempt', function (done) {
        var isStartCalled = false;
        var isStopCalled = false;
        var executeCallsCount = 0;
        var retryCallsCount = 0;
        var isErrorCalled = false;
        var isRunningOnExecute = false;
        var reason;

        var job = new Job(function () {
            debugger;
            if (retryCallsCount < 2) {
                return new Promise(function (resolve, reject) {
                    setTimeout(reject.bind(null, 'hey'), 200);
                });
            } else {
                return new Promise(function (resolve) {
                    setTimeout(resolve.bind(null, 'yo'), 200);
                });
            }
        }, 100);

        job.on('start', function () {
            isStartCalled = true;
        });

        job.on('stop', function () {
            isStopCalled = true;
        });

        job.on('execute', function () {
            executeCallsCount++;
            isRunningOnExecute = job.isRunning;
        });

        job.on('retry', function (msg) {
            retryCallsCount++;
            reason = msg;
        });

        job.on('error', function () {
            isErrorCalled = true;
        });

        job.on('done', function (msg) {
            try {
                expect(isStartCalled).to.be.ok();
                expect(isStopCalled).to.not.be.ok();
                expect(retryCallsCount).to.be(2);
                expect(isErrorCalled).to.not.be.ok();
                expect(executeCallsCount).to.be(3);
                expect(executeCallsCount-1).to.be(retryCallsCount);
                expect(msg).to.equal('yo');
                expect(job.isRunning).to.not.be.ok();
                expect(isRunningOnExecute).to.be.ok();
                expect(reason).to.be('hey');
                done();
            } catch (err) {
                done(err);
            }
        });

        job.start();
    });
});