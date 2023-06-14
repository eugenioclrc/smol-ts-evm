import "mocha";
import { expect } from "chai";

import { ExecutionContext } from "./execution";

describe("ExecutionContextTest", () => {
    // test case for average here
    
    describe("ReadCode", () => {
        it("should revert memory on store wrong value", () => {
            const code = "6022551144669988337722";
           
            const execution = new ExecutionContext(code);
            
            expect(execution.readCode(1)).to.be.equal(0x60);
            expect(execution.readCode(2)).to.be.equal(0x2255);            
        })
    });

    describe("set return data", () => {
        it("should set return data", () => {
            const execution = new ExecutionContext();
            execution.memory.store(0n, 0x01n);

            execution.setReturnData(0n, 1n);

            expect(execution.returndata).to.be.deep.equal([0x01n]);
            expect(execution.stopped).to.be.equal(true);
        });

        it("should set return data", () => {
            const execution = new ExecutionContext();
            execution.memory.store(2n, 0x01n);

            execution.setReturnData(0n, 4n);

            expect(execution.returndata).to.be.deep.equal([0n, 0n, 1n, 0n]);
            expect(execution.stopped).to.be.equal(true);
        });
    })
});
