<script setup lang="ts">
import { ref } from "vue";
import {
  MapboxMap,
  MapboxGeocoder,
  MapboxNavigationControl,
} from "@studiometa/vue-mapbox-gl";

import "@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css";
</script>

<template>
  <MapboxMap
    style="height: 100vh; min-width: 94vw"
    access-token="pk.eyJ1Ijoic2VoYW5kdWsiLCJhIjoiY2w3cmtzOGptMGdiNTN2bnZxemNmajNzaCJ9.ZmuUXZWARzCl1SybKVojww"
    map-style="mapbox://styles/mapbox/streets-v11"
    :center="[0, 0]"
    :zoom="1"
    @mb-created="(mapboxInstance: any) => map = mapboxInstance"
    map="mb-click"
  >
    <MapboxGeocoder />
    <MapboxNavigationControl position="bottom-right" />
  </MapboxMap>
  <button v-on:click="relocateMap()" class="btn-add">add</button>
  <button v-on:click="clickMap()">start</button>
</template>

<style></style>

<script lang="ts">
export default {
  data() {
    return {
      coordinates: null,
      marker: "",
    };
  },

  methods: {
    relocateMap() {
      map.value.panTo([114.9631, -80], { duration: 3000 });
      setTimeout(
        () =>
          map.value.zoomTo(5, {
            duration: 2000,
            offset: [100, 50],
          }),
        3000
      );
    },

    clickMap() {
      map.value.on("click", (e: any) => {
        this.coordinates = e.lngLat;
        console.log(this.coordinates);
      });
    },

    // setMarker() {
    //   if (this.coordinates !== null)
    //     this.marker.setLngLat([this.coordinates.lng, this.coordinates.lat]);

    //   console.log(this.coordinates);
    // },

    addPoint(coordinates: any) {
      map.value.Popup().setLngLat(coordinates);
    },
  },
};
const map = ref();

if (map.value) map.value.on("click", (e: any) => console.log(e.lngLat));

map.value?.on("click", (e: any) => {
  const clickLocation = e.lngLat;
  console.log(clickLocation);

  map.value.flyTo({
    center: clickLocation,
  });

  // Popup to display latitude and longitude of clicked position so that user can select current position.
  // new mapboxgl.Popup()
  //   .setLngLat(clickLocation)
  //   .setHTML(
  //     "Current Location <br/>Latitude: " +
  //       clickLocation.lat.toFixed(4) +
  //       "<br/>Longitude: " +
  //       clickLocation.lng.toFixed(4)
  //   ) // Text appearing on                                                                                                                                             popup.
  //   .addTo(map);

  // if (typeof Storage !== "undefined") {
  //   coordinate = JSON.stringify(clickLocation); // User location stringified and stored to local storage
  //   localStorage.setItem("coordinates", coordinate);
  // } else {
  //   alert("Error: LocalStorage is not supported by current browser.");
  // }
});
</script>
