class CircularList {
    arr;
    size = 0;
    maxsize = 0;
    last = -1;

    constructor(n) {
        this.arr = new Array(n);
        this.maxsize = n;
    }

    get(i) {
        return i < 0 ? null : this.arr[i % this.maxsize];
    }

    put(i, data) {
        this.arr[i % this.maxsize] = data;
    }

    push(data) {
        this.put(++this.last, data);
        this.size++;
        this.size = Math.min(this.size, this.maxsize);
    }

    fetch(i) {
        return this.get(this.last - this.size + i);
    }

    safeMod(a, b) {
        return (b + (a % b)) % b;
    }
}