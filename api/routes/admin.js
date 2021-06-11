const express = require("express");
const router = express.Router();
const axios = require("axios");
const urlApi = "http://192.168.75.9:8080/v1";
const gameInit = require("./dynamic/gameInit");
const Roles = require("./dynamic/enum").Roles;
const Zrr = require("./dynamic/zzr");
const Player = require("./dynamic/player");
const { Composition } = require("./dynamic/enum");
const Meteorite = require("./dynamic/meteorite");

const game = gameInit(
    //this is temporary
    [
        { id: "user1", role: Roles.PLAYER },
        { id: "user2", role: Roles.PLAYER },
        { id: "MFDOOM", role: Roles.PLAYER },
        //{ id: "meteorite0", role: Roles.METEORITE },
        //{ id: "meteorite1", role: Roles.METEORITE },
        //{ id: "meteorite2", role: Roles.METEORITE }
    ]
);

const players = [];
let initTTL = 60000;

const getPlayers = (req, res) => {
    res.status(200).send(game.getPlayers());
};

const getImpacts = (req, res) => {
    res.status(200).send(game.getMeteorites());
}

const filterConnectedUsers = (users) => {
    return users.filter((user) => {
        return user.connected;
    });
};

const getUsers = (req, res) => {
    axios.get(`${urlApi}/users`).then((response) => {
        res.send(filterConnectedUsers(response.data));
    });
};

const getAllUsers = (req, res) => {
    return axios.get(`${urlApi}/users`).then((response) => {
        res.send(response.data);
        return response.data;
    });
};

const getUser = (req, res) => {
    axios.get(`${urlApi}/users/${req.params.id}`).then((response) => {
        res.send(response.data);
    });
};

const setZRR = (req, res) => {
    if (req.body.zrr) {
        if (verifyZRR(req.body.zrr)) {
            const zrr = req.body.zrr;
            game.zrr = new Zrr(
                `zrr${zrr.NO[0] * zrr.SE[0] * zrr.NO[1] * zrr.SE[1]}`,
                zrr.SE,
                [zrr.NO[0], zrr.SE[1]],
                zrr.NO,
                [zrr.SE[0], zrr.NO[1]]
            );
            res.status(201).send("zrr set");
        } else {
            res.status(400).send("bad zrr format");
        }
    } else {
        res.status(400).send("your body doesn't look good");
    }
};

const setTTL = (req, res) => {
    if (req.body.ttl) {
        if (verifyTTL(req.body.ttl)) {
            const ttl = req.body.ttl;
            initTTL = ttl;
            game.setTTL(ttl);
            res.status(201).send("ttl set");
        } else {
            res.status(400).send("bad ttl format");
        }
    } else {
        res.status(400).send("your body doesn't look good");
    }
};

const addPlayer = (req, res) => {
    if (verifyPlayer(req.body.player)) {
        const login = req.body.player.login;
        axios
            .get(`${urlApi}/users/${login}`)
            .then((response) => {
                if (response.data.connected) {
                    if (game.getPlayerById(login).length === 0) {
                        game.addRessource(new Player(login));
                        res.status(201).send();
                    } else {
                        res.status(417).send("player already in the game");
                    }
                } else {
                    res.status(412).send("the Player is not connected");
                }
            })
            .catch((err) => {
                console.log("ERROR");
                res.status(err.response.status).send(err);
            });
    } else {
        res.status(400).send("Your body looks bad");
    }
};

const deletePlayer = (req, res) => {
    if (verifyPlayer(req.body.player)) {
        game.deleteRessource(req.body.player.login);
        res.status(202).send("player deleted from the game");
    } else {
        res.status(400).send("Your body looks bad");
    }
};

const createImpact = (req, res) => {
    if (verifyImpact(req.body.impact)) {
        const { composition, lat, lng } = req.body.impact;
        game.addRessource(
            new Meteorite(
                `${composition}-${lat}-${lng}`,
                [lat, lng],
                composition
            )
        );
        res.status(201).send();
    } else {
        res.status(400).send("your body doesn't look great");
    }
};

const verifyPlayer = (player) => {
    return player.login && typeof player.login === "string";
};

const verifyImpact = (impact) => {
    return (
        typeof impact.composition === "string" &&
        (impact.composition === Composition.astraZ ||
            impact.composition === Composition.astraX ||
            impact.composition === Composition.betaX) &&
        typeof impact.lat === "number" &&
        typeof impact.lng === "number"
    );
};

const verifyZRR = (zrr) => {
    return (
        typeof zrr === "object" &&
        typeof zrr.NO === "object" &&
        typeof zrr.SE === "object" &&
        typeof zrr.NO[0] === "number" &&
        typeof zrr.NO[1] === "number" &&
        typeof zrr.SE[0] === "number" &&
        typeof zrr.SE[1] === "number" &&
        zrr.NO.length === 2 &&
        zrr.SE.length === 2
    );
};

const verifyTTL = (ttl) => {
    return typeof ttl === "number";
};

const startGame = (req, res) => {
    game.start();
    res.status(201).send();
};

router.get("/users", getUsers);
router.get("/allUsers", getAllUsers);
router.get("/users/:id", getUser);
router.put("/ttl", setTTL);
router.put("/zrr", setZRR);
router.post("/start", startGame);
router.get("/players", getPlayers);
router.get("/impacts", getImpacts);
router.post("/addPlayer", addPlayer);
router.post("/deletePlayer", deletePlayer);
router.post("/impact", createImpact);

module.exports = {
    router,
    game,
};
