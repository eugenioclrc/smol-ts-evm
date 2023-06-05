import { Stack } from "./stack";
import { Memory } from "./memory";

export class ExecutionContext{
    code: string;
    stack: Stack;
    memory: Memory;
    pc: number;
    stopped: boolean;

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

    read_code(num_bytes: number): number {
        
        const value = parseInt(String(this.code.slice(this.pc, this.pc + num_bytes)), 16);
        this.pc += num_bytes;
        return value;
    }
}