export class Stack {
    private stack: bigint[];
    private max_depth = 1024;

    constructor(){
        this.stack = [];
    }

    push(item: bigint) {
        if (item < 0n || item > 2n**256n - 1n) {
            throw new Error('InvalidStackItem');
        }

        if (this.stack.length + 1 > this.max_depth) {
            throw new Error('StackOverflow');
        }

        this.stack.push(item);
    }
    
    pop() {
        if (this.stack.length == 0) {
            throw new Error('StackUnderflow');
        }

        return this.stack.pop();
    }

    length() {
      return this.stack.length;
    }
}