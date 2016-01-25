"use strict";

var Job = require('../lib/job').Job;
var expect = require('expect.js');

describe('Scenario 3', function () {
    it('should throw timeout error and be available to be stopped right after error', function (done) {
        var isStartCalled = false;
        var isDoneCalled = false;
        var executeCallsCount = 0;
        var retryCallsCount = 0;
        var isRunningOnExecute = false;
        var reason;

        var job = new Job(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(
                    reject.bind(null, 'hey'),
                    retryCallsCount < 2 ? 200 : 1500
                );
            });
        }, 100);

        job.on('start', function () {
            isStartCalled = true;
        });

        job.on('stop', function () {
            try {
                expect(isStartCalled).to.be.ok();
                expect(isDoneCalled).to.not.be.ok();
                expect(retryCallsCount).to.be(2);
                expect(executeCallsCount).to.be(3);
                expect(executeCallsCount-1).to.be(retryCallsCount);
                expect(job.isRunning).to.not.be.ok();
                expect(isRunningOnExecute).to.be.ok();
                expect(reason).to.be('hey');
                done();
            } catch (err) {
                done(err);
            }
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
            job.stop();
        });

        job.on('done', function () {
            isDoneCalled = true;
        });

        job.executionTimeout = 1000;
        job.start();
    });
});