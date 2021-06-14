<template>
  <div class="game">
    <h1>The Game</h1>
    <Game />
  </div>
</template>
<script>
import Game from "../components/Game";
export default {
    name: "GameVue",
    components: {
        Game,
    },
};
</script>
