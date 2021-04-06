const GeoRessource = require('./geoRessource')
const Roles = require('./enum');

class Player extends GeoRessource {
    constructor(id, pos, url, role = Roles.PLAYER, survivant = true, image = "", ttl = 0, trophys = []) {
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
}

module.exports = Player;