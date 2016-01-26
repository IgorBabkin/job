var DelayGenerator = (function () {
    function DelayGenerator(interval) {
        if (interval === void 0) { interval = 0; }
        this.interval = interval;
    }
    DelayGenerator.prototype.next = function () {
        return this.interval;
    };
    DelayGenerator.prototype.reset = function () {
    };
    return DelayGenerator;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DelayGenerator;
