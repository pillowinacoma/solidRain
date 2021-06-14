<template>
    <div class="about">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>image</th>
                    <th>location</th>
                    <th></th>
                    <th>composition</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="(tro, index) in trophys"  :key="index" > 
                <td v-for="(elem, idx ) in tro" :key="elem" >
                  <img :src="elem" v-if="idx==='_url'"/>
                  <p  v-if="idx==='_position'" > {{elem[0]}} <br/> {{elem[1]}} </p>
                  <p  v-if="idx==='_composition'" > {{elem}}</p>
                </td>
              </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState("player", ["login", "trophys"]),
    },
};
</script>

<style scoped>
.about {
     margin: 0 auto;
     width: 100px; 
}
</style>
