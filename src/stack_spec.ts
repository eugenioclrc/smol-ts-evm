import "mocha";
import { expect } from "chai";

import {Stack}  from "./stack";

describe("StackUnitTest", () => {
    // test case for average here
    
    describe("Push", () => {
        it("should revert stack underflow", () => {
            const stack = new Stack();
            let _error = { message: '' };
            try {
                stack.push(-1n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidStackItem');  
        });
        
        it("should revert stack overflow", () => {
            const stack = new Stack();
            
            let _error = { message: '' };
            try {
                stack.push(2n**256n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('InvalidStackItem');
        });

        it('should push a new value in the stack', () => {
            const stack = new Stack();
            stack.push(1n);
            expect(stack.length()).to.be.equal(1);
        });

        it(`should revert if the stack has more than 1024 items`, () => {
            const stack = new Stack();
            for(let i = 0; i < 1024; i++) {
                stack.push(1n);
            }
            let _error = { message: '' };
            try {
                stack.push(1n);
            } catch (e: any) {
                _error.message = e.message;
            }
            expect(_error.message).to.be.equal('StackOverflow');
        })
    });


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
    
});
