import { Stack } from "./stack";
import { Memory } from "./memory";

export class ExecutionContext{
    code: string;
    stack: Stack;
    memory: Memory;
    pc: number;
    stopped: boolean;
    returndata: bigint[] = [];

    constructor(code: string = "", pc: number = 0, stack: Stack = new Stack(), memory: Memory = new Memory()) {
        this.code = code;
        this.stack = stack;
        this.memory = memory;
        this.pc = pc;
        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    readCode(num_bytes: number): number {
        
        const value = parseInt(String(this.code.slice(this.pc, this.pc + num_bytes)), 16);
        this.pc += num_bytes;

        this.stopped = this.pc >= this.code.length;
        return value;
    }

    setReturnData(offset: bigint, length: bigint) {
        this.stopped = true;
        this.returndata = this.memory.loadRange(offset, length);
    }

}