<template>
    <div class="hello">
        <h1 @click="reverseMessage">{{ msg }}</h1>
        <p>the count is : {{ count }}</p>
        <input type="text" v-model="count" />
        <span v-if="seen" v-bind:title="dick">
            Hover your mouse over me for a few seconds to see my dynamically
            bound title!
        </span>
        <ol id="zaboubi">
            <li v-for="(todo, index) in todos" :key="index">
                {{ index + 1 }} : {{ todo.text }}
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
    data() {
        return {
            count: "text",
            dick:
                "jooooleeeeen" +
                new Date().toLocaleTimeString(),
            seen: true,
            todos: [
                { text: "zaboubya 1" },
                { text: "zaboubya 1" },
                { text: "zaboubya 1" },
                { text: "mamak" },
                { text: "zaboubya 1" },
            ],
        };
    },
    methods: {
        reverseMessage() {
            this.dick = this.dick.split("").reverse().join("");
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
