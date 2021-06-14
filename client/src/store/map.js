import axios from "axios";
import L from "leaflet";

const urlApi = "http://192.168.75.9:3376/api";
const mapStore = {
    state: {
        map: null,
        zoom: 18,
        center: { lat: 45.782, lng: 4.8656 },
        tileLayer: null,
        playerMarker: null,
        othersMarkers: [],
        zrrRect: null,
        impactMarkers: [],
    },
    mutations: {
        map(state, payload) {
            state.map = payload;
        },
        update(state, payload) {
            const { lat, lng } = payload.center;
            const zoom = payload.zoom;

            state.center = { lat, lng };
            state.zoom = zoom;
            state.map.setView(new L.LatLng(lat, lng), zoom);
        },
        tileLayer(state, payload) {
            state.tileLayer = payload;
        },
        zrrRect(state, payload) {
            state.zrrRect = payload;
        },
        playerMarker(state, payload) {
            state.playerMarker = payload;
        },
        updateOthersMarkers(state, payload) {
            state.othersMarkers = payload;
        },
        impactMarkers(state, payload) {
            state.impactMarkers = payload;
        },
        addImpactMarker(state, payload) {
            state.impactMarkers.push(payload);
        },
    },
    actions: {
        createMap(context, payload) {
            context.commit("map", payload);
        },
        updateMap(context, payload) {
            context.commit("update", payload);
        },
        tileLayer(context, payload) {
            context.commit("tileLayer", payload);
        },
        zrrRect(context, payload) {
            context.commit("zrrRect", payload);
        },
        playerMarker(context, payload) {
            context.commit("playerMarker", payload);
        },
        updateOthersMarkers(context, payload) {
            context.commit("updateOthersMarkers", payload);
        },
        impactMarkers(context, payload) {
            context.commit("impactMarkers", payload);
        },
        addImpactMarker(context, payload) {
            context.commit("addImpactMarker", payload);
        },
    },
    getters: {
        getMap: (state) => state.map,
        getZoom: (state) => state.zoom,
        getCenter: (state) => state.center,
        getZrrRect: (state) => state.zrrRect,
        getImpactMarkers: (state) => state.impactMarkers,
    },
    namespaced: true,
};

export default mapStore;
