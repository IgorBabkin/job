import Job from "../lib/job";
let expect = require("expect.js");

describe("Scenario 4", () => {
    it("should trigger an error and must be stopped if executeFn returns non promise result", (done) => {
        let job = new Job(() => true);
        job.on('error', (msg) => {
            try {
                expect(msg).to.be.equal('ExecuteFn must returns a promise object');
                expect(job.isRunning).to.be.ok();
                done();
            } catch (error) {
                done(error);
            }
        });
        job.start();
    });
});