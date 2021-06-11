import { createStore } from "vuex";
import playerStore from "./player";

export default createStore({
    modules: {
        player : playerStore
    },
});
