import { ExecutionContext } from "./execution";
import { Instruction, INSTRUCTIONS_BY_OPCODE } from "./instructions";

function decodeOpcode(context: ExecutionContext): Instruction {
    if (context.pc < 0 || context.pc >= context.code.length) {
        //throw new InvalidCodeOffset({ code: context.code, pc: context.pc });
        throw new Error("InvalidCodeOffset");
    }

    const opcode = context.readCode(2);
    const instruction = INSTRUCTIONS_BY_OPCODE[opcode];
    console.log(opcode);
    if (!instruction) {
        //throw new UnknownOpcode({ opcode });
        throw new Error("UnknownOpcode"+opcode);
    }

    return instruction;
}

export function run(code: string) {
    const context = new ExecutionContext(code);

    while (!context.stopped) {
        const pcBefore = context.pc;
        const instruction = decodeOpcode(context);
        instruction.execute(context);

        console.log(instruction.name, "@ pc=", pcBefore);
        console.log(context)
        console.log("************");
    }
    return context;
}
