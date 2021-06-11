const Game = require("./game");
const Meteorite = require("./meteorite");
const Zrr = require("./zzr");
const Player = require('./player');
const Roles = require("./enum").Roles;

const game = null;

const gameInit = ([...entryRes]) => {
    let ressources = [];

    ressources = entryRes.map((ress, idx) => {
        return ress.role === Roles.METEORITE ?
            new Meteorite(ress.id, [((idx) * 100), ((idx) * 100)]) :
            new Player(ress.id);
    });


    return new Game(new Zrr(), ressources);
}

module.exports = gameInit;