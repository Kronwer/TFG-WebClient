<template>
  <div class="h-screen relative">
    <SearchBar
      @moveToBuilding="moveToBuilding"
      @loadHeatmap="loadHeatmap"
      class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]"
    />
    <div id="map" class="h-full z-[1]"></div>
    <div class="fixed right-12 bottom-8 z-[2]">
      <input type="file" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-slate-600 file:text-white
      hover:file:bg-slate-700
    "/>
    </div>
  </div>
</template>

<script>

import * as L from "leaflet";
import "leaflet.heat";
import { onMounted } from "vue";
import SearchBar from '@/components/SearchBar.vue';

export default {
  name: 'HomeView',
  components: { SearchBar },
  setup() {
  
    let map;
    let layerGroup;

    onMounted(() => {
      // init map
      map = L.map('map').setView([39.480878365981056, -0.3409574554237043], 15);

      // add tile layer
      L
      .tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hnYXJjaWE5OCIsImEiOiJjbDJyd3p0anowMHhoM2NsbXVkdTZlYXNrIn0.esKnkHNbl1d0-hNxQxv34A', 
      {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiY2hnYXJjaWE5OCIsImEiOiJjbDJyd3p0anowMHhoM2NsbXVkdTZlYXNrIn0.esKnkHNbl1d0-hNxQxv34A',
      }).addTo(map);

      layerGroup = L.layerGroup().addTo(map);
    });

    const moveToBuilding = (building) => {
      map.setView([building.latitude, building.longitude], 20);
    }

    const loadHeatmap = (points) => {
      layerGroup.clearLayers();
      layerGroup.addLayer(L.heatLayer(points, { maxZoom: 21}));
      layerGroup.addTo(map);
    }

    return {
      moveToBuilding,
      loadHeatmap
    }
  }
}
</script>