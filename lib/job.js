var events_1 = require("events");
var delayGenerator_1 = require("./delayGenerator");
var DEFAULT_EXECUTING_TIMEOUT = 10 * 1000;
var Job = (function () {
    function Job(executeFn, interval) {
        if (interval === void 0) { interval = 0; }
        this.executeFn = executeFn;
        this._eventEmitter = new events_1.EventEmitter();
        this._delayGenerator = new delayGenerator_1.default(interval);
        this.executionTimeout = DEFAULT_EXECUTING_TIMEOUT;
        this.isRunning = false;
    }
    Job.prototype.on = function (eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    };
    Job.prototype.once = function (eventName, listener) {
        this._eventEmitter.once(eventName, listener);
    };
    Job.prototype._emit = function (eventName, data) {
        this._eventEmitter.emit(eventName, data);
    };
    Job.prototype.start = function () {
        this._emit('start');
        this.isRunning = true;
        this._run();
    };
    Job.prototype.stop = function () {
        clearTimeout(this._timeoutId);
        this._reset();
        this._emit('stop');
    };
    Job.prototype._reset = function () {
        this.isRunning = false;
        this._delayGenerator.reset();
    };
    Job.prototype._done = function (result) {
        this._reset();
        this._emit('done', result);
    };
    Job.prototype._run = function () {
        this._execute().then(this._done.bind(this), this._retry.bind(this));
    };
    Job.prototype._retry = function (reason) {
        if (this.isRunning) {
            var delay = this._delayGenerator.next();
            this._emit('retry', reason);
            this._timeoutId = setTimeout(this._run.bind(this), delay);
        }
    };
    Job.prototype._execute = function () {
        var _this = this;
        this._emit('execute');
        return new Promise(function (resolve, reject) {
            var resultPromise = _this.executeFn();
            var executionTimeoutId = setTimeout(function () {
                var msg = 'Executing timeout is exceeded (' + _this.executionTimeout + 'ms)';
                _this._emit('error', msg);
                reject(msg);
            }, _this.executionTimeout);
            resultPromise.then(clearTimeout.bind(null, executionTimeoutId), clearTimeout.bind(null, executionTimeoutId));
            resultPromise.then(resolve, reject);
        });
    };
    ;
    return Job;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Job;
