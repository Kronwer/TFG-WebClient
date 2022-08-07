<template>
    <div class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-30">
        <div class="relative mx-auto w-1/2 max-w-2xl">
            <div class="bg-white rounded shadow-2xl flex flex-col px-10 py-10">
                <!-- Name Field -->
                    <div class="mb-6">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Name: </label>
                        <input type="email" id="email" v-model="currentBuilding.name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="UPV Test Building">
                    </div>
                    <!-- Floors Field -->
                    <div class="mb-6">
                        <label for="floors" class="block mb-2 text-sm font-medium text-gray-900">Floors</label>
                        <select id="floors" v-model="currentBuilding.floors" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                            <option v-for="index in 8" :key="index">{{ index }}</option>
                        </select>
                    </div>
                    <!-- Latitude Field -->
                    <div class="mb-6">
                        <label for="latitude" class="block mb-2 text-sm font-medium text-gray-900">Latitude</label>
                        <input id="latitude" v-model="currentBuilding.latitude" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" :disabled="true">
                    </div>
                    <!-- Longitude Field -->
                    <div class="mb-6">
                        <label for="longitude" class="block mb-2 text-sm font-medium text-gray-900">Longitude</label>
                        <input id="longitude" v-model="currentBuilding.longitude" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" :disabled="true">
                    </div>
                    <!-- Map -->
                    <div id="map" class="h-64 "></div>
                    <!-- Buttons -->
                    <div class="flex space-x-5 mt-6 mb-6">
                        <!-- Save Button -->
                        <button @click="onSaveButton" :disabled="!currentBuilding.name" class="basis-1/2 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50 disabled:hover:bg-green-500">Save</button>
                        <!-- Cancel Button -->
                        <button @click="onCancelButton" class="basis-1/2 text-black bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Cancel</button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>

import * as L from "leaflet";
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
    name: 'BuildingForm',
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
                    await axios.put(`http://localhost:3000/buildings/${currentBuilding.value.id}`, {
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
                    await axios.post(`http://localhost:3000/buildings`, {
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

        return {
            currentBuilding,
            onSaveButton,
            onCancelButton
        }
    }
}
</script>