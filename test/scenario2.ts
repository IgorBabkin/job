
import Job from "../lib/job";
let expect  = require("expect.js");

describe('Scenario 2', () => {
    it('should be done with 3th attempt', (done) => {
        let isStartCalled = false;
        let isStopCalled = false;
        let executeCallsCount = 0;
        let retryCallsCount = 0;
        let isErrorCalled = false;
        let isRunningOnExecute = false;
        let reason;

        let job = new Job(() => {
            if (retryCallsCount < 2) {
                return new Promise((resolve, reject) => {
                    setTimeout(reject.bind(null, 'hey'), 200);
                });
            } else {
                return new Promise((resolve) => {
                    setTimeout(resolve.bind(null, 'yo'), 200);
                });
            }
        }, 100);

        job.on('start', () => {
            isStartCalled = true;
        });

        job.on('stop', () => {
            isStopCalled = true;
        });

        job.on('execute', () => {
            executeCallsCount++;
            isRunningOnExecute = job.isRunning;
        });

        job.on('retry', (msg) => {
            retryCallsCount++;
            reason = msg;
        });

        job.on('error', () => {
            isErrorCalled = true;
        });

        job.on('done', (msg) => {
            try {
                expect(isStartCalled).to.be.ok();
                expect(isStopCalled).to.not.be.ok();
                expect(retryCallsCount).to.be(2);
                expect(isErrorCalled).to.not.be.ok();
                expect(executeCallsCount).to.be(3);
                expect(executeCallsCount - 1).to.be(retryCallsCount);
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