const express = require('express');
const router = express.Router();
const axios = require('axios');
const urlApi = 'http://192.168.75.9:8080/v1';
const gameInit = require('./dynamic/gameInit');
const Roles = require('./dynamic/enum');
const Zrr = require('./dynamic/zzr');

const game = gameInit(
    //this is temporary
    [
        { id: 'user1', role: Roles.PLAYER },
        { id: 'user2', role: Roles.PLAYER },
        { id: 'MFDOOM', role: Roles.PLAYER },
        { id: "meteorite0", role: Roles.METEORITE },
        { id: "meteorite1", role: Roles.METEORITE },
        { id: "meteorite2", role: Roles.METEORITE }
    ]
);

const players = [];
const initTTL = 60000;

const addPlayer = (id) => {
    
}

const getPlayers = (req, res) => {
    axios.get(`${urlApi}/users`).then(({data}) => {
        const userList = data;
        userList.forEach(({login, connected}) => {
            console.log("_________");
            console.log("login", login);
            console.log("connected", connected);
            console.log("_________");
        });
    })
}

const filterConnectedUsers = (users) => {
    return users.filter((user) => {
        return user.connected;
    });
}

const getUsers = (req, res) => {
    axios.get(`${urlApi}/users`).then((response) => {
        res.send(filterConnectedUsers(response.data));
    })
}

const getAllUsers = (req, res) => {
    return axios.get(`${urlApi}/users`).then((response) => {
        res.send(response.data);
        return (response.data);
    })
}

const getUser = (req, res) => {
    axios.get(`${urlApi}/users/${req.params.id}`).then((response) => {
        res.send(response.data);
    })
}

const setZRR = (req, res) => {
    if (req.body.zrr) {
        if (verifyZRR(req.body.zrr)) {
            const zrr = req.body.zrr;
            game.zrr = new Zrr(
                `zrr${zrr.NO[0] * zrr.SE[0] * zrr.NO[1] * zrr.SE[1]}`,
                zrr.NO, 
                [zrr.SE[0],zrr.NO[1]],
                zrr.SE,
                [zrr.NO[0], zrr.SE[1]]
            );
            res.status(201).send("zrr set");
        } else {
            res.status(400).send("bad zrr format");
        }
    } else {
        res.status(400).send("your body doesn't look good");
    }
}

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
}

const verifyZRR = (zrr) => {
    return (
        typeof zrr === 'object' &&
        typeof zrr.NO === 'object' &&
        typeof zrr.SE === 'object' &&
        typeof zrr.NO[0] === 'number' &&
        typeof zrr.NO[1] === 'number' &&
        typeof zrr.SE[0] === 'number' &&
        typeof zrr.SE[1] === 'number' &&
        zrr.NO.length === 2 &&
        zrr.SE.length === 2
    );
}

const verifyTTL = (ttl) => {
    return (typeof ttl === 'number');
}

const startGame = (req, res) => {
    game.start();
    res.status(201).send();
}

router.get("/users", getUsers);
router.get("/allUsers", getAllUsers);
router.get("/users/:id", getUser);
router.put("/ttl", setTTL);
router.put("/zrr", setZRR);
router.post("/start", startGame);
router.get("/players", getPlayers);
//router.post("/addPlayer", addPlayer);
//router.post("/banPlayer", banPlayer);
//router.post("/impact", createImpact);

module.exports = {
    router,
    game
};