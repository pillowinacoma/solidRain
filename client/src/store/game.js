import axios from "axios";

const urlApi = "https://192.168.75.9/game/api";
const gameStore = {
    state: {
        otherPlayers: null,
        zrr: null,
        impacts: null,
    },
    mutations: {
        UPDATEZRR(state, payload) {
            state.zrr = payload;
        },
        UPDATEIMPACT(state, payload) {
            state.impacts = payload;
        },
        UPDATEOTHERPLAYERS(state, payload) {
            state.otherPlayers = payload;
        },
    },
    actions: {
        getZRR(context, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `${urlApi}/zrr`,
                        {
                            headers: {
                                Authorization: sessionStorage.getItem("token"),
                            },
                        },
                        null
                    )
                    .then((res) => {
                        if (res.status === 200) {
                            const data = res.data;
                            context.commit("UPDATEZRR", data);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getOtherPlayers(context, payload) {
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem("token"),
                },
            };
            const url = `${urlApi}/players`;
            return new Promise((resolve, reject) => {
                axios
                    .get(url, config)
                    .then((res) => {
                        if (res.status === 200) {
                            const data = res.data.map(elem => [elem._id, elem]);
                            context.commit("UPDATEOTHERPLAYERS", data);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        getImpacts(context, payload) {
            const config = {
                headers: {
                    Authorization: sessionStorage.getItem("token"),
                },
            };
            const url = `${urlApi}/impacts`;
            return new Promise((resolve, reject) => {
                axios
                    .get(url, config)
                    .then((res) => {
                        if (res.status === 200) {
                            const data = res.data;
                            context.commit("UPDATEIMPACT", data);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
    },
    getters: {
        zrr: (state) => state.zrr,
        impacts: (state) => state.impacts,
        otherPlayers: (state) => state.otherPlayers,
    },
    namespaced: true,
};

export default gameStore;
