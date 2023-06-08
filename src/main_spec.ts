import "mocha";
import { expect } from "chai";

import { run } from "./main";

describe("ExecutionContextTest", () => {
    // test case for average here
    
    describe("Simple", () => {
        it("should push 32 to stack", () => {
            const context = run("6020");
            expect(context.stack.pop()).to.be.equal(BigInt(0x20));
        })
        it("should sum ", () => {
            const context = run("6020602001");
            expect(context.stack.pop()).to.be.equal(BigInt(0x40));
        })

        it("should mul", () => {
            const context = run("6020600202");
            // 32 * 2
            expect(context.stack.pop()).to.be.equal(64n);
        })
    });
});
