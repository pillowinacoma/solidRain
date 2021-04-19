const Zrr = require('./zzr');
const Roles = require('./enum').Roles;


const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

class Game {
    constructor(zrr = new Zrr(), ressources = []) {
        this._started = false;
        this._zrr = zrr;
        this._ressources = ressources;
        this._distMin = 1;
    }
    get started() {
        return this._started;
    }
    get zrr() {
        return this._zrr;
    }
    set zrr(x) {
        this._zrr = x;
    }
    get ressources() {
        return this._ressources;
    }
    set ressources(x) {
        this._ressources = x;
    }

    addRessource(ressource) {
        this._ressources.push(ressource);
    }
    deleteRessource(resId) {
        //find the ressource
        const resIndexToDelete = this._ressources.reduce((acc, curr, index) => {
            if (curr.id === resId) {
                acc.push(index);
            }
            return acc;
        }, []);
        console.log(resIndexToDelete);
        if (resIndexToDelete) {
            resIndexToDelete.forEach((elem, idx) => {
                this._ressources.splice(elem - idx, 1);

            });
        }
    }
    start() {
        this._started = true;
    }
    finish() {
        this._started = false;
    }
    setTTL(ttl) {
        this.ressources.forEach((player) => {
            if (player._role === Roles.PLAYER) {
                player._ttl = ttl;
            }
        })
    }
    getPlayers() {
        return this.ressources.filter((player) => {
            return player._role === Roles.PLAYER;
        })
    }

    getPlayerById(id) {
        return this.ressources.filter((player) => {
            return player._role === Roles.PLAYER && player.id === id;
        })
    }

    getMeteorites() {
        return this.ressources.filter((player) => {
            return player._role === Roles.METEORITE;
        })
    }

    getClosestMeteorite(playerPos) {
        return this.getMeteorites().reduce((acc, curr) => {
            if (acc != undefined) {
                if (distance(curr._position, playerPos) > distance(acc, playerPos)) {
                    acc = curr;
                }
            } else {
                acc = curr;
            }
            console.log("acc", acc);
            return acc;
        }, undefined)
    }
}

module.exports = Game;