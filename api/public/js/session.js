const Zrr = require('./zrr');

class Session {
    constructor(
        list_users = [],
        list_meteorites = [],
        zrr = Zrr) {
            this.list_users = list_users;
            this.list_meteorites = list_meteorites;
            this.zrr = zrr;
        }
}

module.exports = Session;