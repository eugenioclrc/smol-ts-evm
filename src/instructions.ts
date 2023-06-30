import { ExecutionContext } from "./execution";

const MAX_OVERFLOW = 2n ** 256n;

export const INSTRUCTIONS: Instruction[] = []
export const INSTRUCTIONS_BY_OPCODE:any = {}

export class Instruction {
    opcode: number;
    name: string;

    constructor(opcode: number, name: string) {
        this.opcode = opcode;
        this.name = name;
    }

    execute(context: ExecutionContext) {
        throw new Error("Not implemented");
    }
}

export function registerInstruction(opcode:number, name :string, executeFunc: any) {
    const instruction = new Instruction(opcode, name);
    INSTRUCTIONS.push(instruction);
    instruction.execute = executeFunc;
    INSTRUCTIONS_BY_OPCODE[opcode] = instruction;
    
    return instruction;
}

registerInstruction(0x00, "STOP", (ctx: ExecutionContext) => ctx.stop());
registerInstruction(0x01, "ADD", ((ctx: ExecutionContext) => {
    const stack1 = ctx.stack.pop();
    const stack2 = ctx.stack.pop();

    let sum = stack1 + stack2;
    // check overflow
    sum = sum % MAX_OVERFLOW;
    // push result
    ctx.stack.push(sum);
}));

registerInstruction(0x02, "MUL", ((ctx: ExecutionContext) => {
    const stack1: bigint = ctx.stack.pop();
    const stack2: bigint = ctx.stack.pop();
    let mul = stack1 * stack2;
    // check overflow
    mul = mul % MAX_OVERFLOW;
    // push result
    ctx.stack.push(mul);
}));

registerInstruction(0x60, "PUSH1", ((ctx: ExecutionContext) => {
    ctx.stack.push(BigInt(ctx.readCode(1)));
}));

registerInstruction(0x53, "MSTORE8", ((ctx: ExecutionContext) => { 
    const pos: bigint = ctx.stack.pop();
    // MSTORE8 guarda un byte, un byte es un valor en el intervalo [0, 255]
    // por ello es el `% 256n`
    const val: bigint = ctx.stack.pop() % 256n;
    ctx.memory.store(pos, val);
}));

registerInstruction(0xf3, "RETURN", ((ctx: ExecutionContext) => { 
    const pos = ctx.stack.pop();
    const length = ctx.stack.pop();
    ctx.setReturnData(pos, length);
}));

registerInstruction(0x58, "PC", ((ctx: ExecutionContext) => { 
    ctx.stack.push(BigInt(ctx.pc) - 1n);
}));

registerInstruction(0x56, "JUMP", ((ctx: ExecutionContext) => { 
    const jumpdest = Number(ctx.stack.pop());
    if (!ctx.validjumpdest.has(jumpdest)) {
        throw new Error("InvalidJumpDest");
    }

    ctx.pc = jumpdest;
}));

registerInstruction(0x5b, "JUMPDEST", ((ctx: ExecutionContext) => {
    // esto es para marcar saltos validos
}));

registerInstruction(0x80, "DUP1", ((ctx: ExecutionContext) => {
    ctx.stack.push(ctx.stack.peek(0));
}));

registerInstruction(0x90, "SWAP1", ((ctx: ExecutionContext) => {
    const N = 1;
    if (ctx.stack.length() < N + 1) {
        throw new Error("StackUnderflow");
    }

    let aux:bigint[] = [];
    for (let i = 0; i < N + 1; i++) {
        aux.push(ctx.stack.pop());
    }

    const swap0 = aux[0];
    aux[0] = aux[N];
    aux[N] = swap0;

    for (let i = 0; i < N + 1; i++) {
        ctx.stack.push(aux[N - i]);
    }
}));

registerInstruction(0x91, "SWAP2", ((ctx: ExecutionContext) => { // SWAP N
    const N = 2;
    if (ctx.stack.length() < N + 1) {
        throw new Error("StackUnderflow");
    }

    let aux:bigint[] = [];
    for (let i = 0; i < N + 1; i++) {
        aux.push(ctx.stack.pop());
    }

    const swap0 = aux[0];
    aux[0] = aux[N];
    aux[N] = swap0;

    for (let i = 0; i < N + 1; i++) {
        ctx.stack.push(aux[N - i]);
    }
}));

registerInstruction(0x57, "JUMPI", ((ctx: ExecutionContext) => {
    const jumpdest = Number(ctx.stack.pop());
    const condition = ctx.stack.pop();

    if (!ctx.validjumpdest.has(jumpdest)) {
        throw new Error("InvalidJumpDest");
    }

    if (condition != 0n) {
        ctx.pc = jumpdest;
    }
}));

registerInstruction(0x14, "EQ", ((ctx: ExecutionContext) => {
    const val0 = ctx.stack.pop();
    const val1 = ctx.stack.pop();
    ctx.stack.push(val0 == val1 ? 1n : 0n);
}));

/*
const INSTRUCTIONS = {
  STOP : 0x00,
  ADD : 0x01,
  MUL : 0x02,
  SUB : 0x03,
  DIV : 0x04,
  SDIV : 0x05,
  MOD : 0x06,
  SMOD : 0x07,
  ADDMOD : 0x08,
  MULMOD : 0x09,
  EXP : 0x0a,
  SIGNEXTEND : 0x0b,
  LT : 0x10,
  GT : 0x11,
  SLT : 0x12,
  SGT : 0x13,
  EQ : 0x14,
  ISZERO : 0x15,
  AND : 0x16,
  OR : 0x17,
  XOR : 0x18,
  NOT : 0x19,
  SHA3 : 0x20,
  BYTE : 0x1a,
  SHL : 0x1b,
  SHR : 0x1c,
  SAR : 0x1d,
  ADDRESS : 0x30,
  BALANCE : 0x31,
  ORIGIN : 0x32,
  CALLER : 0x33,
  CALLVALUE : 0x34,
  CALLDATALOAD : 0x35,
  CALLDATASIZE : 0x36,
  CALLDATACOPY : 0x37,
  CODESIZE : 0x38,
  CODECOPY : 0x39,
  GASPRICE : 0x3a,
  EXTCODESIZE : 0x3b,
  EXTCODECOPY : 0x3c,
  RETURNDATASIZE : 0x3d,
  RETURNDATACOPY : 0x3e,
  EXTCODEHASH : 0x3f,
  COINBASE : 0x41,
  TIMESTAMP : 0x42,
  NUMBER : 0x43,
  DIFFICULTY : 0x44,
  GASLIMIT : 0x45,
  CHAINID : 0x46,
  SELFBALANCE : 0x47,
  BASEFEE : 0x48,
  POP : 0x50,
  MLOAD : 0x51,
  MSTORE : 0x52,
  MSTORE8 : 0x53,
  SLOAD : 0x54,
  SSTORE : 0x55,
  JUMP : 0x56,
  JUMPI : 0x57,
  PC : 0x58,
  MSIZE : 0x59,
  GAS : 0x5a,
  JUMPDEST : 0x5b,
  PUSH0 : 0x5f,
  PUSH1 : 0x60,
  PUSH32 : 0x7f,
  DUP1 : 0x80,
  DUP16 : 0x8f,
  SWAP1 : 0x90,
  SWAP16 : 0x9f,
  LOG0 : 0xa0,
  LOG1 : 0xa1,
  LOG2 : 0xa2,
  LOG3 : 0xa3,
  LOG4 : 0xa4,
  CREATE : 0xf0,
  CALL : 0xf1,
  RETURN : 0xf3,
  DELEGATECALL : 0xf4,
  STATICCALL : 0xfa,
  REVERT : 0xfd,
  SELFDESTRUCT : 0xff,
  INVALID : 0xfe,
  BLOCKHASH : 0x40,
}
*/
