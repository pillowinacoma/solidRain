<template>
  <div class="game">
    <h1>The Game</h1>
    <Map />
  </div>
</template>
<script>
import Map from "../components/Map";
export default {
    name: "Game",
    components: {
        Map,
    },
};
</script>
