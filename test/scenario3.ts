import Job from "../lib/job";
let expect  = require("expect.js");

describe('Scenario 3', () => {
    it('should throw timeout error and be available to be stopped right after error', (done) => {
        let isStartCalled = false;
        let isDoneCalled = false;
        let executeCallsCount = 0;
        let retryCallsCount = 0;
        let isRunningOnExecute = false;
        let reason;

        let job = new Job(() => {
            return new Promise((resolve, reject) => {
                setTimeout(
                    reject.bind(null, 'hey'),
                    retryCallsCount < 2 ? 200 : 1500
                );
            });
        }, 100);

        job.on('start', () => {
            isStartCalled = true;
        });

        job.on('stop', () => {
            try {
                expect(isStartCalled).to.be.ok();
                expect(isDoneCalled).to.not.be.ok();
                expect(retryCallsCount).to.be(2);
                expect(executeCallsCount).to.be(3);
                expect(executeCallsCount - 1).to.be(retryCallsCount);
                expect(job.isRunning).to.not.be.ok();
                expect(isRunningOnExecute).to.be.ok();
                expect(reason).to.be('hey');
                done();
            } catch (err) {
                done(err);
            }
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
            job.stop();
        });

        job.on('done', () => {
            isDoneCalled = true;
        });

        job.executionTimeout = 1000;
        job.start();
    });
});