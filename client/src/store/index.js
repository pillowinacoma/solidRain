import { createStore } from "vuex";
import playerStore from "./player";
import gameStore from "./game";
import mapStore from "./map";

export default createStore({
    modules: {
        player: playerStore,
        game: gameStore,
        map: mapStore,
    },
});
