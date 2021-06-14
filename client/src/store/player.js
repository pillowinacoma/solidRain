import axios from "axios";

const urlApi = "https://192.168.75.9/game/api";
const playerStore = {
    state: {
        token: null,
        login: "",
        url: "",
        position: [],
        role: "",
        survivant: true,
        gagnant: false,
        ttl: 60,
        timer: null,
        trophys: {},
    },
    mutations: {
        UPDATETOKEN(state, payload) {
            state.token = payload;
        },
        UPDATELOGIN(state, payload) {
            state.login = payload;
        },
        UPDATEURL(state, payload) {
            state.url = payload;
        },
        UPDATEPOSITION(state, payload) {
            state.position = payload;
        },
        UPDATEROLE(state, payload) {
            state.role = payload;
        },
        UPDATETTL(state, payload) {
            state.ttl = payload;
        },
        UPDATEGAGNANT(state, payload) {
            state.gagnant = payload;
        },
        UPDATESURVIVANT(state, payload) {
            state.survivant = payload;
        },
        UPDATETROPHYS(state, payload) {
            state.trophys = payload;
        },
        UPDATEOTHERS(state, payload) {
            state.otherPlayers = payload;
        },
    },
    actions: {
        login(context, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${urlApi}/login`, {
                        login: payload.login,
                        password: payload.password,
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            sessionStorage.setItem("token", res.data);
                            context.commit("UPDATELOGIN", payload.login);
                            context.commit("UPDATETOKEN", res.data);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        logout(context, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .delete(
                        `${urlApi}/logout`,
                        {
                            headers: {
                                authorization: context.getters.token,
                            },
                        },
                        null
                    )
                    .then((res) => {
                        if (res.status === 204) {
                            sessionStorage.removeItem("token");
                            context.commit("UPDATELOGIN", "");
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getMe(context, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `${urlApi}/me`,
                        {
                            headers: {
                                authorization: sessionStorage.getItem("token"),
                            },
                        },
                        null
                    )
                    .then((res) => {
                        if (res.status === 200) {
                            const me = res.data[0];
                            console.log(me);
                            context.commit("UPDATELOGIN", me._id);
                            context.commit("UPDATEPOSITION", me._position);
                            context.commit("UPDATEROLE", me._role);
                            context.commit("UPDATESURVIVANT", me._survivant);
                            context.commit("UPDATETROPHYS", me._trophys);
                            context.commit("UPDATEURL", me._url);
                            context.commit("UPDATETTL", me._ttl);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        setPosition(context, payload) {
            context.commit("UPDATEPOSITION", payload);
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            const url = `${urlApi}/players/${context.getters.login}/position`;
            const content = JSON.stringify({
                position: payload,
            });
            return new Promise((resolve, reject) => {
                axios
                    .put(url, content, config)
                    .then((res) => {
                        if (res.status === 204) {
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        setToken(context, payload) {
            context.commit("UPDATETOKEN", payload);
        },
        setTrophys(context, payload) {
            context.commit("UPDATETROPHYS", payload);
        },
        setSurvivant(content, payload) {
            content.commit("UPDATESURVIVANT", payload);
        },
        setGagnant(context, payload) {
            context.commit("UPDATEGAGNANT", payload);
        },
        startTimer(context, payload) {
            context.state.timer = setInterval(() => {
                context.state.ttl--;
                if (context.state.ttl <= 0) {
                    context.state.ttl = 0;
                    window.clearInterval(context.state.timer);
                    context.state.gagnant = false;
                    context.state.gagnant = false;
                }
            }, 1000);
        },
    },
    getters: {
        login: (state) => state.login,
        position: (state) => state.position,
        token: (state) => state.token,
    },
    namespaced: true,
};

export default playerStore;
