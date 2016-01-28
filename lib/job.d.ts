/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
declare class Job {
    executeFn: Function;
    private _eventEmitter;
    private _delayGenerator;
    private _timeoutId;
    executionTimeout: number;
    isRunning: boolean;
    constructor(executeFn: Function, interval?: number);
    on(eventName: any, listener: any): void;
    once(eventName: any, listener: any): void;
    private _emit(eventName, data?);
    start(): void;
    stop(): void;
    private _reset();
    private _done(result);
    private _run();
    private _retry(reason);
    private _execute();
}
export default Job;
