"use strict";

var EventEmitter = require('events');
var DelayGenerator = require('./delayGenerator').DelayGenerator;
var DEFAULT_EXECUTING_TIMEOUT = 10000;

/**
 * @constructor
 */
function Job (executeFn, interval) {
    this.executeFn = executeFn;
    this.eventEmitter = new EventEmitter();
    this.delayGenerator = new DelayGenerator(interval);
    this.executionTimeout = DEFAULT_EXECUTING_TIMEOUT;
}

Job.prototype.on = function (event, listener) {
    this.eventEmitter.on(event, listener);
};

Job.prototype.once = function (event, listener) {
    this.eventEmitter.once(event, listener);
};

Job.prototype.start = function () {
    this.emit('start');
    this.isRunning = true;
    this.run();
};

Job.prototype.stop = function () {
    clearTimeout(this.timeoutId);
    this.reset();
    this.emit('stop');
};

Job.prototype.emit = function (event, data) {
    this.eventEmitter.emit(event, data);
};

Job.prototype.reset = function () {
    this.isRunning = false;
    this.delayGenerator.reset();
};

Job.prototype.done = function (result) {
    this.reset();
    this.emit('done', result);
};

Job.prototype.run = function () {
    this.execute().then(
        this.done.bind(this),
        this.retry.bind(this)
    );
};

Job.prototype.retry = function (reason) {
    if (this.isRunning) {
        var delay = this.delayGenerator.next();
        this.emit('retry', reason);
        this.timeoutId = setTimeout(this.run.bind(this), delay);
    }
};

Job.prototype.execute = function () {
    this.emit('execute');

    return new Promise(function (resolve, reject) {
        var resultPromise = this.executeFn();

        var executionTimeoutId = setTimeout(function () {
            var msg = 'Executing timeout is exceeded (' + this.executionTimeout + 'ms)';
            this.emit('error', msg);
            reject(msg);
        }.bind(this), this.executionTimeout);

        resultPromise.then(
            clearTimeout.bind(null, executionTimeoutId),
            clearTimeout.bind(null, executionTimeoutId)
        );

        resultPromise.then(resolve, reject);
    }.bind(this));
};

exports.Job = Job;