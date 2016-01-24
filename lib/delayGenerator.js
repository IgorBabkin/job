"use strict";

/**
 * @param {int} interval
 * @constructor
 */
function DelayGenerator (interval) {
    this.interval = typeof interval === "number" ? interval : 0;
}

DelayGenerator.prototype.next = function () {
    return this.interval;
};

DelayGenerator.prototype.reset = function () {

};

exports.DelayGenerator = DelayGenerator;
