const GeoRessource = require('./geoRessource')
const Roles = require('./enum').Roles;

class Player extends GeoRessource {
    constructor(id, pos, url, role = Roles.PLAYER, survivant = true, image = "", ttl = 0, trophys = ["tr1", "tr2"]) {
        super(id, pos, url, role);
        this._survivant = survivant;
        this._image = image;
        this._ttl = ttl;
        this._trophys = trophys;
    }
    get survivant() {
        return this._survivant;
    }

    set survivant(x) {
        this._survivant = x;
    }

    get image() {
        return this._image;
    }

    set image(x) {
        this._image = x;
    }

    get ttl() {
        return this._ttl;
    }

    set ttl(x) {
        this._ttl = x;
    }

    get trophys() {
        return this._trophys;
    }

    set trophys(x) {
        this._trophys = x;
    }

    addTrophy(t){
        this._trophys.push(t);
    }
}

module.exports = Player;