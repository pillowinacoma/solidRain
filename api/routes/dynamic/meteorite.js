const GeoRessource = require("./geoRessource");
const Roles = require('./enum')

class Meteorite extends GeoRessource {
    constructor(id, pos, url, composition = null, role = Roles.METEORITE) {
        super(id, pos, url, role);
        this._composition = composition;
    }

    get composition() {
        return this._composition;
    }

    set composition(x) {
        this._composition = x;
    }

}

module.exports = Meteorite;