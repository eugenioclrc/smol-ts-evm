export class Memory {
    private memory: bigint[] = [];

    store(offset: bigint, value: bigint) {
        // valid offset
        if (offset < 0n || offset > 2n**256n - 1n) {
            throw new Error('InvalidMemoryAccess');
        }
        // valid value
        if (value < 0n || value > 255n /* 2n**8n - 1n */) {
            throw new Error('InvalidMemoryValue');
        }

        for(let i = this.memory.length; i < Number(offset); i++) {
            this.memory.push(0n);
        }

        this.memory[Number(offset)] = value;
    }
    
    load(offset: bigint) {
        // valid offset
        if (offset < 0n || offset > 2n**256n - 1n) {
            throw new Error('InvalidMemoryAccess');
        }

        return this.memory[Number(offset)] || 0n;
    }


    loadRange(offset: bigint, length: bigint) {
        if  ((offset +length) > (2n**256n - 1n)) {
            throw new Error("InvalidMemoryAccess");
        }

        const ret: bigint[] = [];

        for(let i = 0n; i < length; i += 1n) {
            ret.push(this.load(offset + i));
        }
    
        return ret;
    }

    length() {
        return this.memory.length;
    }
}