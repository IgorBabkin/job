declare class DelayGenerator {
    private interval;
    constructor(interval?: number);
    next(): number;
    reset(): void;
}
export default DelayGenerator;
