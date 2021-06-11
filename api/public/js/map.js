// initialisation de la map
let lat = 45.782,
    lng = 4.8656,
    zoom = 19;

let ZRR;
const urlApi = window.location.origin;

const crossIcon = L.icon({
    iconUrl: "http://simpleicon.com/wp-content/uploads/cross.png",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [-3, -76],
});

const rockIcons = {
    astraZ: L.icon({
        iconUrl: "../img/astraZrock.png",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    }),
    astraX: L.icon({
        iconUrl: "../img/astraXrock.png",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    }),
    betaX: L.icon({
        iconUrl: "../img/betaXrock.png",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    }),
};

const zrrMarkerOptions = {
    draggable: true,
    //icon: crossIcon,
    autoPan: true,
};

const impactMarkerOptions = {
    astraZ: { icon: rockIcons.astraZ },
    astraX: { icon: rockIcons.astraX },
    betaX: { icon: rockIcons.betaX },
};

let mymap = L.map("map", {
    center: [lat, lng],
    zoom: zoom,
});
//updateMap();

// Création d'un "tile layer" (permet l'affichage sur la carte)
L.tileLayer(
    "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
    {
        maxZoom: 22,
        minZoom: 1,
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
            "pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
    }
).addTo(mymap);

// Ajout d'un marker
const noMarker = L.marker(
    [45.781832651414547, 4.865173091842237],
    zrrMarkerOptions
)
    .addTo(mymap)
    .bindPopup("Entrée du bâtiment<br><strong>Nautibus</strong>.")
    .openPopup();
const seMarker = L.marker(
    [45.78226474728544, 4.866168141388876],
    zrrMarkerOptions
)
    .addTo(mymap)
    .bindPopup("Entrée du bâtiment<br><strong>Nautibus</strong>.")
    .openPopup();

// Clic sur la carte
mymap.on("click", (e) => {
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    updateMap();
});

// Mise à jour de la map
function updateMap() {
    // Affichage à la nouvelle position
    mymap.setView([lat, lng], zoom);

    // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
    return false;
}

const drawRect = (event) => {
    const { lat: nolat, lng: nolng } = noMarker.getLatLng();
    const { lat: selat, lng: selng } = seMarker.getLatLng();
    const bounds = [
        [nolat, nolng],
        [selat, selng],
    ];
    const zrrRectOptions = {
        color: "#ff7800",
        weight: 1,
    };
    mymap.eachLayer((layer) => {
        if (layer instanceof L.Rectangle) {
            mymap.removeLayer(layer);
        }
    });
    const rect = L.rectangle(bounds, zrrRectOptions).addTo(mymap);

    $("#lat1").val(rect._bounds._northEast.lat);
    $("#lon1").val(rect._bounds._southWest.lng);
    $("#lat2").val(rect._bounds._southWest.lat);
    $("#lon2").val(rect._bounds._northEast.lng);
};

const sendZrr = () => {
    if (
        $("#lat1").val() &&
        $("#lon1").val() &&
        $("#lat2").val() &&
        $("#lon2").val()
    ) {
        const data = {
            zrr: {
                NO: [
                    parseFloat($("#lat1").val()),
                    parseFloat($("#lon1").val()),
                ],
                SE: [
                    parseFloat($("#lat2").val()),
                    parseFloat($("#lon2").val()),
                ],
            },
        };
        const headers = new Headers({
            "Content-Type": "application/json",
        });
        fetch(`${urlApi}/admin/zrr`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    ZRR = data.zrr;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return false;
};

noMarker.on("dragend", drawRect);
seMarker.on("dragend", drawRect);

const sendTTL = () => {
    if ($("#ttl").val()) {
        const data = {
            ttl: parseInt($("#ttl").val()),
        };
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        fetch(`${urlApi}/admin/ttl`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data),
        }).then((r) => {
            renderPlayers();
        })
    }
    return false;
};

const sendMETEOR = () => {
    $("#map").focus();
    const meteorType = $(`select[name="meteorType"]`).val();
    mymap.off("click");
    mymap.on("click", (event) => {
        const { lat, lng } = event.latlng;
        if (verifyInZrr(lat, lng)) {
            const data = {
                impact: {
                    composition: meteorType,
                    lat: lat,
                    lng: lng,
                },
            };
            const headers = new Headers({
                "Content-Type": "application/json",
            });
            fetch(`${urlApi}/admin/impact`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.ok) {
                        L.marker(
                            event.latlng,
                            impactMarkerOptions[meteorType]
                        ).addTo(mymap);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log("you're out of the ZRR");
        }
    });
    return false;
};

const verifyInZrr = (lat, lng) => {
    return (
        lat < ZRR.NO[0] && lat > ZRR.SE[0] && lng > ZRR.NO[1] && lng < ZRR.SE[1]
    );
};

const renderUsers = () => {
    fetch(`${urlApi}/admin/allUsers`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data instanceof Array) {
                const template = $("#userTemplate").html();
                data.forEach((user) => {
                    const rendered = Mustache.render(template, user);
                    $("#usersList").append(rendered);
                });
            }
        });
};

const renderPlayers = () => {
    fetch(`${urlApi}/admin/players`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data instanceof Array) {
                $("#playersList").html("");
                const template = $("#playerTemplate").html();
                data.forEach((user) => {
                    const rendered = Mustache.render(template, user);
                    $("#playersList").append(rendered);
                });
            }
        });
};

//send zrr after the map is set
drawRect();
sendZrr();

renderUsers();
renderPlayers();
