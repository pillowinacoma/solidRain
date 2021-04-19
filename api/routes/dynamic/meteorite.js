const GeoRessource = require("./geoRessource");
const Roles = require("./enum").Roles;
const Composition = require("./enum").Composition;

class Meteorite extends GeoRessource {
    constructor(
        id,
        pos,
        composition = Composition.astraZ,
        url,
        role = Roles.METEORITE
    ) {
        super(id, pos, url, role);
        this._composition = composition;
        this._consumed = false;
        this._consumerId = null;
    }

    get composition() {
        return this._composition;
    }

    set composition(x) {
        this._composition = x;
    }

    get consumed() {
        return this._consumed;
    }

    get consumerId() {
        return this._consumerId;
    }

    consume(conId) {
        this._consumed = true;
        this._consumerId = conId;
    }
}

module.exports = Meteorite;
