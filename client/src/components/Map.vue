<template>
  <section>
    <h2>Carte</h2>
    <p class="content">
      <strong>TODO :</strong> mettre À jour les positions des différents objets
      sur la carte.
    </p>
    <div id="map" class="map"></div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";

// This part resolves an issue where the markers would not appear in webpack
import { Icon } from "leaflet";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// initialisation de la map
let lat = 45.782,
    lng = 4.8656,
    zoom = 19;
let mymap = {};

export default {
    name: "Map",
    methods: {
    // ProcÃ©dure de mise Ã  jour de la map
        updateMap: function () {
            // Affichage Ã  la nouvelle position
            mymap.setView([lat, lng], zoom);

            // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
            return false;
        },
    },
    async beforeMount() {
    // HERE is where to load Leaflet components!
        const L = await import("leaflet");
        // ProcÃ©dure d'initialisation
        mymap = L.map("map", {
            center: [lat, lng],
            zoom: zoom,
        });
        //updateMap();

        // CrÃ©ation d'un "tile layer" (permet l'affichage sur la carte)
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
        ).addTo(mymap);

        // Ajout d'un marker
        L.marker([45.78207, 4.86559])
            .addTo(mymap)
            .bindPopup("Entrée du batiment<br><strong>Nautibus</strong>.")
            .openPopup();

        // Clic sur la carte
        mymap.on("click", (e) => {
            lat = e.latlng.lat;
            lng = e.latlng.lng;
            this.updateMap();
        });
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
