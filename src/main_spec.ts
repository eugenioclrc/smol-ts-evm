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

    describe("Returning Data", () => {
        it("should ff with mstore8", () => {
            const context = run("60ff600053");
            console.log(context.memory);
            expect(context.memory.load(0x00n)).to.be.equal(0xffn);
        });

        it("should ffff with mstore8", () => {
            const context = run("60ff60005360ff600153");
            expect(context.memory.load(0x00n)).to.be.equal(0xffn);
            expect(context.memory.load(0x01n)).to.be.equal(0xffn); 
        });

        it("should return ffff", () => {
            const context = run("600160015360026000f3");
            expect(context.returndata).to.be.deep.equal([0x00n, 0x01n]);
        })
    });

});
