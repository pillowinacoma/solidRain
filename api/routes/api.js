const express = require('express');
const router = express.Router();
const axios = require('axios');
const adminResources = require('./admin');
const Roles = require('./dynamic/enum');

const game = adminResources.game;
const distMin = game._distMin;


const urlApi = 'http://192.168.75.9:8080/v1';

const authUser = (request) => {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    }
    const data = {
        params: {
            token: request.headers.authorization,
            origin: request.headers.origin
        }
    }
    return axios.get(`${urlApi}/authenticate`, data, config);
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

const okPosition = (pos) => {
    return Array.isArray(pos) &&
        pos.length === 2 &&
        typeof pos[0] === 'number' &&
        typeof pos[1] === 'number';
}


const getCurrPlayerId = (location) => {
    const locTab = location.split("/");
    return locTab[locTab.length - 1]
}

const verifyLogPwd = (body) => {
    return typeof body.login === 'string' && typeof body.password === 'string';
}

const loginUser = (req, res) => {
    const data = new URLSearchParams();
    data.append('login', req.body.login);
    data.append('password', req.body.password);
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            origin: req.headers.origin,
            accept: "application/json"
        }
    }
    axios.post(`${urlApi}/login`, data, config).then((response) => {
        res.setHeader('Authorization', response.headers.authorization);
        res.send()
    }).catch((err) => {
        console.log(err);
    })
}

const logoutUser = (req, res) => {
    authUser(req).then((response) => {
        headers = {
            headers : {
                'Authorization' : req.headers.authorization
            }
        }
        axios.delete(`${urlApi}/logout`, headers).then((response) => {
            res.status(204).send();
        }).catch((err) => {
            console.log("err", err);
            res.status(400).send("error zebi");
        })
    })
}

const getZrr = (req, res) => {
    authUser(req).then((response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(game.zrr));
    }).catch((err) => {
        console.log(err);
    })
}

const getImpacts = (req, res) => {
    authUser(req).then((response) => {
        const impacts = game.getMeteorites();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(impacts));
    }).catch((err) => {
        console.log(err);
    })
}

const getAllPlayers = (req, res) => {
    authUser(req).then((response) => {
        const players = game.getPlayers();
        res.setHeader('Content-Type', 'application/json');
        res.send(players);
    }).catch((err) => {
        console.log(err);
    })
}

const getPlayers = (req, res) => {
    authUser(req).then((response) => {
        const currPlayerId = getCurrPlayerId(response.headers.location);
        const players = game.getPlayers().filter((ressource) => {
            return (ressource.id !== currPlayerId);
        })
        res.setHeader('Content-Type', 'application/json');
        res.send(players);
    }).catch((err) => {
        console.log(err);
    })
}

const getMe = (req, res) => {
    authUser(req).then((response) => {
        const currPlayerId = getCurrPlayerId(response.headers.location);
        const currPlayer = game.getPlayerById(currPlayerId);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(currPlayer);   

    }).catch((err) => {
        console.log(err);
    })
}

const getRessources = (req, res) => {
    authUser(req).then((response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(game);
    }).catch((err) => {
        console.log(err);
    })
}

const updateImage = (req, res) => {
    authUser(req).then((response) => {
        const id = req.params.id;
        const updatedimage = req.body.imageLink;


        if (validURL(updatedimage)) {
            resId = game.ressources.findIndex((res) => (res.id === id));
            game.ressources[resId]._url = updatedimage;
            res.status(204).send();
            console.log(game.ressources[resId]);
        } else {
            res.status(400).send("req.body.imageLink not ok");
        }
    }).catch((err) => {
        console.log("PUT position auth error", err);
        res.status(401).send("AUTH error, BAD TOKEN");
    })
}
const updatePosition = (req, res) => {
    authUser(req).then((response) => {
        const id = req.params.id;
        const updatedPosition = req.body.position;


        if (okPosition(updatedPosition)) {
            resId = game.ressources.findIndex((res) => (res.id === id));
            game.ressources[resId]._position = updatedPosition;
            res.status(204).send();
        } else {
            res.status(400).send("req.body.position not ok");
        }
    }).catch((err) => {
        console.log("PUT position auth error", err);
        res.status(401).send("AUTH error, BAD TOKEN");
    })
}

const createAccount = (req, res) => {
    if (verifyLogPwd(req.body)) {
        const data = new URLSearchParams();
        data.append('login', req.body.login);
        data.append('password', req.body.password);
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                origin: req.headers.origin,
                accept: "application/json"
            }
        }
        axios.post(`${urlApi}/users`, data, config).then((response) => {
            //res.setHeader('Authorization', response.headers.authorization);
            console.log(response);
            res.status(201).send()
        }).catch((err) => {
            console.log(err);
            res.status(500).send("problem occured while requesting spring server");
        })
    }else{
        res.status(400).send("your body isn't good enough");
    }
}

const recupererMeteorite = (req, res) => {
    if(okPosition(req.body.position)){
        res.send(game.getClosestMeteorite(req.body.position));
    }else{
        res.status(400).send("your body looks bad")
    }
}



router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.get("/ressources", getRessources);
router.get("/zrr", getZrr);
router.get("/players", getPlayers);
router.get("/me", getMe);
router.get("/allPlayers", getAllPlayers);
router.get("/impacts", getImpacts);
router.put("/players/:id/position", updatePosition);
router.put("/players/:id/image", updateImage);
router.put("/players/:id/harvest", recupererMeteorite);
router.put("/create", createAccount);

module.exports = router;
