class Zrr {
    constructor(
        id = "zrr0",
        limite_NO = [0, 0],
        limite_NE = [1000, 0],
        limite_SE = [1000, 1000],
        limite_SO = [0, 1000]
    ) {
        this.id = id;
        this.limite_NE = limite_NE;
        this.limite_NO = limite_NO;
        this.limite_SE = limite_SE;
        this.limite_SO = limite_SO;
    }
}

module.exports = Zrr;