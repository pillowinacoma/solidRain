import axios from "axios";

const urlApi = "http://192.168.75.9:3376/api";
const playerStore = {
    state: {
        login: "",
        password: "",
        url: "",
        survivant: true,
        game: {},
        timer: {},
        trophys: [],
        otherPlayers: "",
    },
    mutations: {
        LOGIN(state, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${urlApi}/login`, {
                        login: payload.login,
                        password: payload.password,
                    })
                    .then((res) => {
                        console.log("STATUS : ", status);
                        if (res.status === 200) {
                            console.log("auth token", res.headers);
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        console.log("FAIL", err);
                        reject(false);
                    });
            });
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
                        console.log("STATUS : ", status);
                        if (res.status === 200) {
                            console.log(
                                "auth token",
                                res.headers.authorization
                            );
                            sessionStorage.setItem(
                                "token",
                                res.headers.authorization
                            );
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
                                authorization: sessionStorage.getItem("token"),
                            },
                        },
                        null
                    )
                    .then((res) => {
                        if (res.status === 204) {
                            sessionStorage.removeItem("token");
                            resolve(true);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
    },
    getters: {},
    namespaced: true,
};

export default playerStore;
