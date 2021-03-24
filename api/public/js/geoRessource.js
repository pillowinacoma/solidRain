const Enum = require('./enum');

class GeoResource {
    constructor(
        id,
        url = "àmettre",
        position = [0,0],
        role = Enum.role.PLAYER,
        ttl = 0,
        trophys = []) {
    this.id = id;
    this.url = url;
    this.position = position;
    this.role = role;
    this.ttl = ttl;
    this.trophys = trophys;
}

module.exports = GeoResource;