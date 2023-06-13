import "mocha";
import { expect } from "chai";

import {Memory}  from "./memory";

describe("MemoryUnitTest", () => {
    // test case for average here
    
    describe("Store", () => {
        it("should revert memory on store wrong value", () => {
            const memory = new Memory();
            let _error = { message: '' };
            try {
                memory.store(-1n, 3n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidMemoryAccess'); 
            
            _error = { message: '' };
            try {
                memory.store(2n**256n, 3n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidMemoryAccess'); 

            try {
                memory.store(0n, -3n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidMemoryValue'); 
            
            _error = { message: '' };
            try {
                memory.store(4n, 2n**256n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidMemoryValue'); 
        });

        it("should store a new value in the memory", () => {
            const memory = new Memory();
            memory.store(0n, 1n);
            expect(memory.length()).to.be.equal(1);
            memory.store(9n, 1n);
            expect(memory.length()).to.be.equal(10);
        })

        it("should read a value in the memory", () => {
            const memory = new Memory();
            memory.store(0n, 1n);
            memory.store(9n, 42n);
            expect(memory.load(0n)).to.be.equal(1n);
            expect(memory.load(9n)).to.be.equal(42n);
            expect(memory.load(5n)).to.be.equal(0n);
            expect(memory.load(20n)).to.be.equal(0n);
        })

        it("should read a range value in the memory", () => {
            const memory = new Memory();
            memory.store(0n, 1n);
            memory.store(1n, 42n);
            memory.store(3n, 42n);
            expect(memory.loadRange(0n, 4n)).to.be.deep.equal([1n, 42n, 0n, 42n]);
            expect(memory.loadRange(1n, 4n)).to.be.deep.equal([42n, 0n, 42n, 0n]);
            expect(memory.loadRange(1n, 2n)).to.be.deep.equal([42n, 0n]);

            expect(memory.loadRange(100n, 2n)).to.be.deep.equal([0n, 0n]);

            expect(memory.loadRange(100n, 2n)).to.be.deep.equal([0n, 0n]);

            expect(memory.loadRange(2n**256n - 2n, 1n)).to.be.deep.equal([0n]);

            expect(() => memory.loadRange(2n**256n - 1n, 1n)).to.throw('InvalidMemoryAccess');

        })
    });
/*

    describe("Pop", () => {
        let stack: Stack;
        let item = 1n;
        beforeEach(() => {
            stack = new Stack();
            stack.push(item);
        });

        it("should pop the last item in the stack", () => {
            const actual = stack.pop();
            expect(actual).to.be.equal(item);
        });
    });
    */
    
});
