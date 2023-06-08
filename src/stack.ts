export class Stack {
    private stack: bigint[] = [];
    private max_depth = 1024;

    push(item: bigint) {
        if (item < 0n || item > 2n**256n - 1n) {
            throw new Error('InvalidStackItem');
        }

        if (this.stack.length + 1 > this.max_depth) {
            throw new Error('StackOverflow');
        }

        this.stack.push(item);
    }
    
    pop(): bigint {
        if (this.stack.length == 0) {
            throw new Error('StackUnderflow');
        }
        
        const ret = this.stack.pop();
        return ret!;

    }

    length() {
      return this.stack.length;
    }
}