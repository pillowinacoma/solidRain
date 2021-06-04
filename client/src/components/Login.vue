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
        <button v-on:click="logged">Send</button>
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
        logged() {
            console.log("login", this.loginVal);
            console.log("password", this.passwordVal);

            this.$router.push('/game')
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
