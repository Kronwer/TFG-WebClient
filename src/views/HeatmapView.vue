<template>
  <div class="h-screen relative">
    <SearchBar
      @moveToBuilding="moveToBuilding"
      @loadHeatmap="loadHeatmapPoints"
      class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]"
    />
    <div id="map" class="h-full z-[1]"></div>
    <div class="fixed right-12 bottom-8 z-[2]">
      <input 
        type="file"
        class="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-slate-600 file:text-white
                hover:file:bg-slate-700"
        accept="image/*"
        @change="handleImageUpload($event)"
      />
    </div>
    <div v-if="buildingFloors" class="flex flex-col-reverse fixed left-8 bottom-8 z-[2] rounded-xl bg-white p-2">
      <div v-for="floor in buildingFloors" v-bind:key="floor">
        <input v-if="floor === 1" type="radio" :id="floor" v-model="selectedFloor" :value="floor" @change="updateHeatmap()" class="peer hidden" checked/>
        <input v-else type="radio" :id="floor" v-model="selectedFloor" :value="floor" @change="updateHeatmap()" class="peer hidden" />
        <label :for="floor" class="block cursor-pointer select-none rounded-xl px-4 py-2 text-center font-bold peer-checked:bg-gray-800 peer-checked:font-bold peer-checked:text-white">{{ floor }}</label>
      </div>
    </div>
  </div>
</template>

<script>

import * as L from "leaflet";
import "leaflet.heat";
import "leaflet-toolbar/dist/leaflet.toolbar.css";
import "leaflet-toolbar";
import "leaflet-distortableimage";
import { onMounted, ref } from "vue";
import SearchBar from '@/components/SearchBar.vue';

import "leaflet-distortableimage/dist/leaflet.distortableimage.css";
import "leaflet-distortableimage/dist/vendor.js";


export default {
  name: 'HomeView',
  components: { SearchBar },
  setup() {

    const selectedFloor = ref(1);
    const buildingFloors = ref(null);
  
    let map;
    let heatmapPoints;
    let heatmapLayer;
    let imageLayer;
    let layerControl;
    let osm;
    let streets;
    let googleStreets;
    let googleHybrid;
    let googleSatellite;

    onMounted(() => {
      // init map
      map = L.map('map').setView([39.480878365981056, -0.3409574554237043], 15);

      // add tile layer
      streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hnYXJjaWE5OCIsImEiOiJjbDJyd3p0anowMHhoM2NsbXVkdTZlYXNrIn0.esKnkHNbl1d0-hNxQxv34A', 
      {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiY2hnYXJjaWE5OCIsImEiOiJjbDJyd3p0anowMHhoM2NsbXVkdTZlYXNrIn0.esKnkHNbl1d0-hNxQxv34A',
      }).addTo(map);

      osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(map);

      googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(map);

      googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(map);

      var baseMaps = {
        "OpenStreetMap": osm,
        "MapBox Streets": streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
        "Google Satellite": googleSatellite
      }

      layerControl = L.control.layers(baseMaps).addTo(map);

      heatmapLayer = L.layerGroup().addTo(map);
      imageLayer = L.layerGroup().addTo(map);

      layerControl.addOverlay(heatmapLayer, "Heatmap");
    });

    const moveToBuilding = (building) => {
      imageLayer.clearLayers();
      map.setView([building.latitude, building.longitude], 20);
      buildingFloors.value = building.floors;
    }

    const loadHeatmapPoints = (points) => {
      heatmapPoints = points;
      updateHeatmap();
    }

    const updateHeatmap = () => {
      heatmapLayer.clearLayers();
      heatmapLayer.addLayer(L.heatLayer(heatmapPoints.filter(
        point => point.floorNumber === selectedFloor.value
        ).map(({latitude, longitude}) => [latitude, longitude]), { maxZoom: 21}));
    }

    const onFileLoad = (event, callback) => {
      const input = event.target;

      const reader = new FileReader();
      reader.onload = function () {
        const dataURL = reader.result;
        callback(dataURL);
      };
      reader.readAsDataURL(input.files[0]);
};

    const handleImageUpload = (event) => {
      onFileLoad(event, (url) => {
        imageLayer.addLayer(L.distortableImageOverlay(url).addTo(map));
      });
    }

    const printSelected = () => {
      console.log(selectedFloor.value);
    }

    return {
      selectedFloor,
      buildingFloors,
      moveToBuilding,
      loadHeatmapPoints,
      updateHeatmap,
      handleImageUpload,
      printSelected
    }
  }
}
</script>

<style>
  .leaflet-toolbar-icon {
    background-color: black;
  }
</style>