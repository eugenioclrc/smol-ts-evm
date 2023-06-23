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

    describe("JUMPs", () => {

        it("should work PC", () => {
            const context = run("58");
            expect(context.stack.pop()).to.be.equal(0x00n);
        });

        it("should work another PC", () => {
            const context = run("604258");
            expect(context.stack.pop()).to.be.equal(0x02n);
            expect(context.stack.pop()).to.be.equal(0x42n);
        });

        it("should work JUMP", () => {
            expect(() => run("60ff56")).to.throw("InvalidJumpDest");
        });

        it("should work JUMP", () => {
            const context = run("60055660015b");            
            expect(context.stack.length()).to.be.equal(0);
        });
    })

    describe("DUPs", () => {
        it("should work DUP1", () => {
            const context = run("600280");
            expect(context.stack.peek(0)).to.be.equal(0x02n);
            expect(context.stack.peek(1)).to.be.equal(0x02n);
        });
    });

    describe("DUPs", () => {
        it("should work DUP1", () => {
            const context = run("5b60025b605b");
            expect(context.validjumpdest).to.be.deep.equal(new Set([0, 3]));
        });
    });

});
