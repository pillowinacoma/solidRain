class Zrr {
    constructor(
        id,
        limite_NO = [0,0],
        limite_NE = [0,0],
        limite_SE = [0,0],
        limite_SO = [0,0]) {
    this.id = id;
    this.limite_NO = limite_NO;
    this.limite_NE = limite_NE;
    this.limite_SE = limite_SE;
    this.limite_SO = limite_SO;
}

module.exports = Zrr;