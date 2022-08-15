<template>
    <div class="flex flex-col gap-y-4 bg-white px-10 py-10">
        <!-- Name Field -->
        <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input type="email" id="email" v-model="currentBuilding.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="UPV Test Building">
        </div>
        <!-- Floors Field -->
        <div>
            <label for="floors" class="block mb-2 text-sm font-medium text-gray-900">Floors</label>
            <FloorCounter
                :floors="building.floors"
                :fromBuildingTable="true"
                @onFloorUpdated="updateFloor" />
        </div> 
        <!-- Latitude Field -->
        <div>
            <label for="latitude" class="block mb-2 text-sm font-medium text-gray-900">Latitude</label>
            <input id="latitude" v-model="currentBuilding.latitude" class="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg block w-full p-2.5" :disabled="true">
        </div>
        <!-- Longitude Field -->
        <div>
            <label for="longitude" class="block mb-2 text-sm font-medium text-gray-900">Longitude</label>
            <input id="longitude" v-model="currentBuilding.longitude" class="bg-gray-50 border border-gray-300 text-gray-400 text-sm rounded-lg block w-full p-2.5" :disabled="true">
        </div>
        <!-- Map -->
        <div id="map" class="h-64"></div>
        <!-- Buttons -->
        <div class="flex space-x-5 mt-6 mb-6">
            <!-- Save Button -->
            <button @click="onSaveButton" :disabled="!currentBuilding.name" class="basis-1/2 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50 disabled:hover:bg-green-500">Save</button>
            <!-- Cancel Button -->
            <button @click="onCancelButton" class="basis-1/2 text-black bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Cancel</button>
        </div>
    </div>
</template>

<script>

import * as L from "leaflet";
import { ref, onMounted } from "vue";
import axios from "axios";
import FloorCounter from '@/components/FloorCounter.vue';

export default {
    name: 'BuildingForm',
    components: { FloorCounter },
    props: ['building','editMode'],
    setup(props, { emit }) {

        let map;
        // eslint-disable-next-line
        var marker;

        const currentBuilding = ref(JSON.parse(JSON.stringify(props.building)));

        // Create Leaflet Map
        onMounted(() => {

            // init map
            map = L.map('map').setView([currentBuilding.value.latitude, currentBuilding.value.longitude], 18);
            
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

            console.log

            marker = L.marker([currentBuilding.value.latitude, currentBuilding.value.longitude]).addTo(map);
            
            map.on("move", () => {
                marker.setLatLng(map.getCenter());
                currentBuilding.value.latitude = map.getCenter().lat;
                currentBuilding.value.longitude = map.getCenter().lng;
            });
        });

        // Cancel Button Listener
        const onCancelButton = () => {
            emit("onCloseButton");
        }

        // Save Button Listener
        const onSaveButton = async () => {
            if (props.editMode) {
                // Axios call to update building
                try {
                    await axios.put(`http://192.168.18.118:3000/buildings/${currentBuilding.value.id}`, {
                        name: currentBuilding.value.name,
                        floors: currentBuilding.value.floors,
                        latitude: currentBuilding.value.latitude,
                        longitude: currentBuilding.value.longitude
                    });
                    emit('onSaveButton', currentBuilding.value);
                } catch(err) {
                    alert(err.message);
                }
                
            } else {
                // Axios call to create new building
                try {
                    await axios.post(`http://192.168.18.118:3000/buildings`, {
                        name: currentBuilding.value.name,
                        floors: currentBuilding.value.floors,
                        latitude: currentBuilding.value.latitude,
                        longitude: currentBuilding.value.longitude
                    });
                    emit('onSaveButton', currentBuilding.value);
                } catch(err) {
                    alert(err.message);
                }
                
            }
        }

        const updateFloor = (floorNumber) => {
            currentBuilding.value.floors = floorNumber;
        }

        return {
            currentBuilding,
            onSaveButton,
            onCancelButton,
            updateFloor
        }
    }
}
</script>