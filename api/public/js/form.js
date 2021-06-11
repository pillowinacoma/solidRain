// MàJ de l'indicateur numérique du zoom
function updateZoomValue() {
    $("#zoomValue").html($("#zoom").val());
    updateMap();
}

// Abonnement aux événements de changement
$("#lat").change(updateMap);
$("#lon").change(updateMap);
$("#zoom").change(updateZoomValue);

const addPlayer = (login) => {
    const data = {
        player: {
            login: login,
        },
    };
    const headers = new Headers({
        "Content-Type": "application/json",
    });
    fetch(`${urlApi}/admin/addPlayer`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    }).then((response) => {
        renderPlayers();
    });
    return false;
};

const deletePlayer = (login) => {
    const data = {
        player: {
            login: login,
        },
    };
    const headers = new Headers({
        "Content-Type": "application/json",
    });
    fetch(`${urlApi}/admin/deletePlayer`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    }).then((response) => {
        renderPlayers();
    });
    return false;
};