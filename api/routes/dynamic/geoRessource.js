const Enum = require('./enum').Roles;

class GeoRessource {
    constructor(
        id,
        position = [0, 0],
        url = "https://picsum.photos/200/200",
        role = Enum.Roles.PLAYER
    ) {
        this._id = id;
        this._url = url;
        this._position = position;
        this._role = role;
    }

    get id() {
        return this._id;
    }

    set id(x) {
        this._id = x;
    }

    get url() {
        return this._url;
    }

    set url(x) {
        this._url = x;
    }

    get position() {
        return this._position;
    }

    set position(x) {
        this._position = x;
    }

    get role() {
        return this._role;
    }

    set role(x) {
        this._role = x;
    }

}

module.exports = GeoRessource;