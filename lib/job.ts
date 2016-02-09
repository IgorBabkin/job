/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../typings/node/node.d.ts" />

import { EventEmitter } from "events";
import DelayGenerator from "./delayGenerator";

const DEFAULT_EXECUTING_TIMEOUT = 10 * 1000;

class Job {
    private _eventEmitter: EventEmitter;
    private _delayGenerator: DelayGenerator;
    private _timeoutId: number;
    public executionTimeout: number;
    public isRunning: boolean;

    constructor (public executeFn: Function, interval = 0) {
        this._eventEmitter = new EventEmitter();
        this._delayGenerator = new DelayGenerator(interval);
        this.executionTimeout = DEFAULT_EXECUTING_TIMEOUT;
        this.isRunning = false;
    }

    on (eventName, listener) {
        this._eventEmitter.on(eventName, listener);
    }

    once (eventName, listener) {
        this._eventEmitter.once(eventName, listener);
    }

    private _emit (eventName, data?) {
        this._eventEmitter.emit(eventName, data);
    }

    start () {
        this._emit('start');
        this.isRunning = true;
        this._run();
    }

    stop () {
        clearTimeout(this._timeoutId);
        this._reset();
        this._emit('stop');
    }

    private _reset () {
        this.isRunning = false;
        this._delayGenerator.reset();
    }

    private _done (result) {
        this._reset();
        this._emit('done', result);
    }

    private _run () {
        this._execute().then(
            this._done.bind(this),
            this._retry.bind(this)
        )
    }

    private _retry (reason) {
        if (this.isRunning) {
            let delay: number = this._delayGenerator.next();
            this._emit('retry', reason);
            this._timeoutId = setTimeout(this._run.bind(this), delay);
        }
    }

    private _execute () {
        this._emit('execute');

        return new Promise((resolve, reject) => {
            let resultPromise: Promise<any> = this.executeFn();

            if (!this._isPromise(resultPromise)) {
                this._emit('error', "ExecuteFn must returns a promise object");
                this.stop();
            }

            let executionTimeoutId = setTimeout(() => {
                let msg = 'Executing timeout is exceeded (' + this.executionTimeout + 'ms)';
                this._emit('error', msg);
                reject(msg);
            }, this.executionTimeout);

            resultPromise.then(
                clearTimeout.bind(null, executionTimeoutId),
                clearTimeout.bind(null, executionTimeoutId)
            );

            resultPromise.then(resolve, reject);
        });
    };

    private _isPromise(promise): Boolean {
        return !!promise && !!promise.then;
    }
}

export default Job;