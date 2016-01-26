import Job from "../lib/job";
let expect  = require("expect.js");

describe('Scenario 1', () => {
    it('should be done with first attempt', (done) => {
        let isStartCalled = false;
        let isStopCalled = false;
        let executeCallsCount = 0;
        let isRetryCalled = false;
        let isErrorCalled = false;
        let job = new Job(() => new Promise((resolve) => {
            setTimeout(resolve.bind(null, 'yo'), 500);
        }), 100);

        job.on('start', () => {
            isStartCalled = true;
        });

        job.on('stop', () => {
            isStopCalled = true;
        });

        job.on('execute', () => {
            executeCallsCount++;
        });

        job.on('retry', () => {
            isRetryCalled = true;
        });

        job.on('error', () => {
            isErrorCalled = true;
        });

        job.on('done', (msg) => {
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