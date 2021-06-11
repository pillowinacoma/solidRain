<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Map />
  </div>
</template>
<script>
import Map from "../components/Map";
export default {
    name: "About",
    props: {
        map: Map,
    },
};
</script>
