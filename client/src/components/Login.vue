<template>
    <form id="loginForm" v-on:submit.prevent="onSubmit">
        <label for="login">Login :</label>
        <input v-model="loginVal" type="text" name="login" id="login" />
        <br />
        <label for="password">Password :</label>
        <input
            v-model="passwordVal"
            type="password"
            name="password"
            id="password"
        />
        <br />
        <h1>{{ login }}</h1>
        <button v-on:click="loggingIn">Send</button>
        <button v-on:click="logout">Logout</button>
    </form>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            //login: "",
            //password: "",
        };
    },

    name: "Login",
    computed: {
        ...mapState("player", ["login"]),
    },
    methods: {
        loggingIn() {
            this.$store
                .dispatch("player/login", {
                    login: this.loginVal,
                    password: this.passwordVal,
                })
                .then((succ) => {
                    this.$store
                        .dispatch("player/getMe")
                        .then((succ) => {
                            console.log(succ);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    //this.$router.push('/');
                })
                .catch((err) => {
                    console.log("ERROR", err);
                });
        },
        logout() {
            this.$store
                .dispatch("player/logout", null)
                .then((succ) => {
                    console.log("SUCCESS", succ);
                    sessionStorage.clear();
                })
                .catch((err) => {
                    console.log("ERR", err);
                });
        },
    },
};
</script>

<style scoped>
input,
input[type="submit"],
select {
    background-color: #2f4f4f !important;
    color: lightgray;
    border: 1px solid;
}
</style>
