import { Stack } from "./stack";
import { Memory } from "./memory";

export class ExecutionContext{
    code: string;
    stack: Stack;
    memory: Memory;
    pc: number;
    stopped: boolean;
    returndata: bigint[] = [];
    validjumpdest: Set<number> = new Set([]);

    constructor(code: string = "", pc: number = 0, stack: Stack = new Stack(), memory: Memory = new Memory()) {
        this.code = code;
        this.stack = stack;
        this.memory = memory;
        this.pc = pc;
        this.stopped = false;
        this.initJumpDest(code);
    }

    initJumpDest(code: string) {
        let i = 0;
        while (i < code.length) {
            const opcode = parseInt(code.slice(i, i + 2), 16);
            if (opcode == 0x5b) {
                this.validjumpdest.add(i / 2);
            } else if(opcode == 0x60) {
                // @audit recordar preparar todo para skipear push2 ... push32, preguntarle a adri
                i += 2;
            }
            i += 2;
        }
    }

    stop() {
        this.stopped = true;
    }

    readCode(num_bytes: number): number {
        // num_bytes * 2 because each byte is represented by 2 characters
        const value = parseInt(String(this.code.slice(this.pc * 2, this.pc * 2 + num_bytes * 2)), 16);
        this.pc += num_bytes;

        this.stopped = this.pc >= (this.code.length / 2);
        return value;
    }

    setReturnData(offset: bigint, length: bigint) {
        this.stopped = true;
        this.returndata = this.memory.loadRange(offset, length);
    }

}