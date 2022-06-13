<template>
  <div class="flex flex-col gap-8 pt-8">
    <div class="h-12 flex justify-center">
      <button
        class="
          w-2/5
          px-4
          py-2
          font-semibold
          text-xl
          bg-green-500
          text-white
          rounded-full
          shadow-sm
          hover:bg-green-600
        "
      >
        Add Building
      </button>
    </div>
    <div>
      <table class="divide-y divide-gray-300 w-screen text-center">
        <thead class="bg-gray-50">
          <tr class="text-xs text-gray-500">
            <th class="px-6 py-2">ID</th>
            <th class="px-6 py-2">Name</th>
            <th class="px-6 py-2">Latitude</th>
            <th class="px-6 py-2">Longitude</th>
            <th class="px-6 py-2"></th>
            <th class="px-6 py-2"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-300">
          <tr v-for="building in buildings" v-bind:key="building.id" class="whitespace-nowrap text-sm text-gray-900">
            <td class="px-6 py-4">{{ building.id }}</td>
            <td class="px-6 py-4">{{ building.name }}</td>
            <td class="px-6 py-4">{{ building.latitude }}</td>
            <td class="px-6 py-4">{{ building.longitude }}</td>
            <td class="px-6 py-4">
              <a
                href="#"
                class="px-4 py-1 text-sm text-white bg-blue-400 rounded"
                >Edit</a
              >
            </td>
            <td class="px-6 py-4">
              <a
                href="#"
                class="px-4 py-1 text-sm text-white bg-red-400 rounded"
                >Delete</a
              >
            </td>
          </tr>   
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import { ref } from "vue";

export default {

    setup() {

        const buildings = ref(null);

        const loadBuildings = () => {
            axios.get("http://localhost:3000/building").then((response) => {
                buildings.value = response.data;
            })
        }

        // Execute methods
        loadBuildings();

        return {
            buildings
        }
    }

};
</script>