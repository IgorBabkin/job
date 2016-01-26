class DelayGenerator {
    constructor (private interval = 0) {}

    next () {
        return this.interval;
    }

    reset () {
    }
}

export default DelayGenerator;