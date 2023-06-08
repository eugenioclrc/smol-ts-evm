import "mocha";
import { expect } from "chai";

import { ExecutionContext } from "./execution";

describe("ExecutionContextTest", () => {
    // test case for average here
    
    describe("Foo", () => {
        it("should revert memory on store wrong value", () => {
            const code = "6022551144669988337722";
           
            const execution = new ExecutionContext(code);
            
            expect(execution.readCode(2)).to.be.equal(0x60);
            expect(execution.readCode(4)).to.be.equal(0x2255);
            
        })
    });
});
