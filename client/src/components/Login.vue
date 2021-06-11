<template>
    <form id="loginForm" v-on:submit.prevent="onSubmit">
        <p>{{ loginVal }}</p>
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
        <button v-on:click="loggingIn">Send</button>
        <button v-on:click="logout">Logout</button>
    </form>
</template>

<script>
export default {
    data() {
        return {
            //login: "",
            //password: "",
        };
    },

    name: "Login",
    methods: {
        loggingIn() {
            console.log("login", this.loginVal);
            console.log("password", this.passwordVal);
            this.$store
                .dispatch("player/login", {
                    login: this.loginVal,
                    password: this.passwordVal,
                })
                .then((succ) => {
                    console.log("LOGGED IN", succ);
                    //this.$router.push('/');
                })
                .catch((err) => {
                    console.log("ERROR", err);
                });
        },
        logout() {
            console.log("humm");
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
