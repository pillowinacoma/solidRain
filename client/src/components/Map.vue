<template>
    <section>
        <p>Temps restant : {{ ttl }} s</p>
        <p>status : {{ survivant == true ? "surviving" : "wasted" }}</p>
        <p>{{ gagnant ? "You Won !" : "" }}</p>
        <p class="content">
            <button @click="harvest">Harvest</button>
        </p>
        <div id="map" class="map"></div>
    </section>
</template>

<script>
import "leaflet/dist/leaflet.css";

// This part resolves an issue where the markers would not appear in webpack
import L, { Icon } from "leaflet";
import { mapState } from "vuex";
import {
    zrrToBounds,
    playerMarkerOptions,
    pmIcon,
    othIcon,
    rockIcons,
    distance,
} from "../utils/mapUtils";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
    name: "Map",
    methods: {
        harvest: function () {
            const minDist = 0.01;
            const closestImpacts = this.impacts
                .map((impact) => {
                    const [lat1, lng1] = this.position;
                    const [lat2, lng2] = impact._position;
                    return {
                        id: impact._id,
                        impact: impact,
                        dist: distance(lat1, lng1, lat2, lng2),
                    };
                })
                .filter((elem) => elem.dist <= minDist)
                .forEach((meteor) => {
                    if (meteor.impact._composition === "betaX") {
                        this.$store.dispatch("player/setSurvivant", false);
                    }
                    if (meteor.impact._composition === "astraX") {

                        this.$store.dispatch("player/setGagnant", true);
                    }
                    const trotros = this.trophys;
                    trotros[meteor.id] = meteor.impact;
                    this.$store.dispatch("player/setTrophys", trotros);
                });
        },
        updateMap: function () {
            const zoom = this.$store.getters["map/getZoom"];
            let { lat, lng } = this.center;
            // Affichage Ã  la nouvelle position
            this.map.setView([lat, lng], zoom);

            this.$store.dispatch("game/getZRR").then((succ) => {
                const rect = this.$store.getters["map/getZrrRect"];
                const zrr = { ...this.$store.getters["game/zrr"] };
                rect.setBounds(zrrToBounds(zrr));
                rect.addTo(this.map);
            });

            this.$store
                .dispatch("game/getImpacts")
                .then((succ) => {
                    const impacts = this.impacts;
                    const tmpctMkrs = this.impactMarkers;
                    const diff = impacts.length - tmpctMkrs.length;
                    if (impacts.length > 0) {
                        this.$store.dispatch("player/startTimer");
                    }

                    if (diff != 0) {
                        const poses = Object.entries(impacts).map(
                            (impact, idx) => {
                                const { _position } = impact[1];
                                return [..._position];
                            }
                        );
                        const impactMarkers = poses
                            .slice(-diff)
                            .map((pos) => {
                                return L.marker(pos, {
                                    icon: L.icon(rockIcons["astraZ"]),
                                });
                            })
                            .map((elem) => {
                                elem.addTo(this.map);
                                return elem;
                            });
                        this.$store.dispatch(
                            "map/impactMarkers",
                            this.impactMarkers.concat(impactMarkers)
                        );
                    }
                })
                .catch((err) => console.log);
            this.$store
                .dispatch("game/getOtherPlayers")
                .then((succ) => {
                    const diff =
                        this.otherPlayers.length - this.othersMarkers.length;
                    if (diff != 0) {
                        const poses = this.otherPlayers.map(([id, playa]) => {
                            const { _position } = playa;
                            return [id, [..._position]];
                        });

                        const om = poses
                            .slice(-diff)
                            .map(([id, pos]) => {
                                return [
                                    id,
                                    L.marker(pos, { icon: L.icon(othIcon) }),
                                ];
                            })
                            .map(([id, mark]) => {
                                mark.addTo(this.map);
                                return [id, mark];
                            });
                        this.$store.dispatch("map/updateOthersMarkers", om);
                    }
                    [...this.othersMarkers].forEach(([id, mark]) => {
                        const opm = { ...mark };
                        const [oid, op] = [
                            ...this.otherPlayers.find((elem) => elem[0] === id),
                        ];
                        mark.setLatLng([...{ ...op }._position]);
                    });
                })
                .catch((err) => console.log);
            // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
            return false;
        },
    },
    computed: {
        ...mapState("map", [
            "map",
            "zoom",
            "tileLayer",
            "layers",
            "playerMarker",
            "othersMarkers",
            "zrrTriangle",
            "impactMarkers",
            "center",
        ]),
        ...mapState("game", ["zrr", "otherPlayers", "impacts"]),
        ...mapState("player", [
            "position",
            "trophys",
            "ttl",
            "gagnant",
            "survivant",
        ]),
    },
    mounted() {
        if (!("geolocation" in navigator)) {
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log(pos);
            },
            (err) => {
                console.log(err);
            }
        );
    },
    async beforeMount() {
        const zoom = this.$store.getters["map/getZoom"];
        let { lat, lng } = this.$store.getters["map/getCenter"];
        // HERE is where to load Leaflet components!
        const L = await import("leaflet");
        // ProcÃ©dure d'initialisation
        this.$store
            .dispatch(
                "map/createMap",
                L.map("map", {
                    center: [lat, lng],
                    zoom: zoom,
                })
            )
            .then((succ) => {})
            .catch((err) => console.log);
        // CrÃ©ation d'un "tile layer" (permet l'affichage sur la carte)

        this.$store.dispatch(
            "map/tileLayer",

            L.tileLayer(
                "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
                {
                    maxZoom: 22,
                    minZoom: 1,
                    attribution:
                        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
                    id: "mapbox/streets-v11",
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken:
                        "pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
                }
            )
        );

        this.tileLayer.addTo(this.map);

        this.map.on("zoomend", (event) => {
            this.$store.dispatch("map/updateMap", {
                zoom: this.map.getZoom(),
                center: this.map.getCenter(),
            });
        });

        this.map.on("dragend", (event) => {
            this.$store.dispatch("map/updateMap", {
                zoom: this.map.getZoom(),
                center: this.map.getCenter(),
            });
        });

        // adding markers
        this.$store.dispatch("player/setPosition", this.map.getCenter());
        const playerPos = this.position;
        const playerMarker = L.marker(playerPos, {
            ...playerMarkerOptions,
            icon: L.icon(pmIcon),
        })
            .addTo(this.map)
            .bindPopup("<strong>Moi</strong>.")
            .on("dragend", () => {
                const { lat, lng } = playerMarker.getLatLng();
                this.$store
                    .dispatch("player/setPosition", [lat, lng])
                    .then((succ) => {
                        this.updateMap();
                    });
            });

        this.$store.dispatch("map/playerMarker", playerMarker);
        this.$store.dispatch("map/impactMarkers", []);
        this.$store.dispatch("map/updateOthersMarkers", []);

        this.$store
            .dispatch("game/getZRR")
            .then((succ) => {
                const bounds = { ...this.$store.getters["game/zrr"] };
                const rect = L.rectangle(zrrToBounds(bounds)).addTo(this.map);
                this.$store.dispatch("map/zrrRect", rect);
            })
            .catch((err) => {
                console.log("can't update zrr");
            });

        this.updateMap();

        let geoLocId;
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        function error(err) {
            console.warn("ERROR(" + err.code + "): " + err.message);
        }

        let latlng = [0, 0];
        const currMarker = L.marker(latlng, {
            icon: L.icon(rockIcons["betaX"]),
        }).addTo(this.map);

        const success = (pos) => {
            var crd = pos.coords;

            const loclat = crd.latitude;
            const loclong = crd.longitude;
            console.log("lat", [loclat, loclong]);
            //currMarker.setLatLng([loclat, loclong]);
            //this.updateMap();
        };

        //geoLocId = navigator.geolocation.watchPosition(success, error, options);
    },
};
</script>

<style scoped>
.map {
    height: 400px;
    width: 100%;
    border: 1px solid;
}
</style>
