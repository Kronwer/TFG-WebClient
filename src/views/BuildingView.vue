<template>
  <div class="flex flex-col gap-8 pt-8 bg-gray-100">
    <!-- Add Building Button -->
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
        @click="onAddButton"
      >
        Add Building
      </button>
    </div>
    <!-- Table -->
    <div class="px-10">
      <table class="divide-y divide-gray-300 w-full text-center table-auto border-b border-gray-200 shadow">
        <thead class="bg-gray-50">
          <!-- Header Titles -->
          <tr class="text-xs text-gray-500">
            <th class="px-6 py-2">ID</th>
            <th class="px-6 py-2">Name</th>
            <th class="px-6 py-2">Floors</th>
            <th class="px-6 py-2">Latitude</th>
            <th class="px-6 py-2">Longitude</th>
            <th class="px-6 py-2 w-32"></th>
            <th class="px-6 py-2 w-32"></th>
          </tr>
        </thead>
        <!-- Table Rows -->
        <tbody class="bg-white divide-y divide-gray-300">
          <!-- For loop to create building rows from an array -->
          <tr
            v-for="(building, index) in buildings"
            v-bind:key="building.id"
            class="whitespace-nowrap text-sm text-gray-900 h-1 min-h-0"
          >
            <!-- ID Field -->
            <td class="px-6 py-4">{{ building.id }}</td>
            <!-- Name Field -->
            <td class="px-6 py-4">{{ building.name }}</td>
            <!-- Floors Fields -->
            <td class="px-6 py-4">{{ building.floors }}</td>
            <!-- Latitude Field -->
            <td class="px-6 py-4">{{ building.latitude }}</td>
            <!-- Longitude Field -->
            <td class="px-6 py-4">{{ building.longitude }}</td>
            <!-- Edit Button -->
            <td class="px-6 py-4">
              <button 
                class="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded w-20"
                @click="currentIndex = index; onEditButton(building)" >
                Edit
              </button>
            </td>
          <!-- Delete Button -->
            <td class="px-6 py-4">
              <button 
                class="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded w-20"
                @click="currentIndex = index; onDeleteButton(building)">
                Delete
              </button>
            </td>    
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Building Editing Modal Window -->
    <BuildingForm
      v-if="showBuildingForm"
      :editMode="editMode"
      :building="currentBuilding"
      @onSaveButton="updateBuildings"
      @onCloseButton="hideBuildingForm"/>
    <div v-if="showBuildingForm" class="absolute inset-0 z-20 opacity-25 bg-black"></div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import BuildingForm from '@/components/BuildingForm.vue';

export default {
  components: { BuildingForm },
  setup() {
    const addMode = ref(false);
    const editMode = ref(false);
    const buildings = ref(null);
    const currentBuilding = ref(null);
    const currentIndex = ref(null);
    const showBuildingForm = ref(false);


    // API Call to get all buildings
    const loadBuildings = () => {
      try {
        axios.get("http://localhost:3000/buildings").then((response) => {
          buildings.value = response.data;
        });
      } catch(err) {
        alert(err.message);
      }
      
    };

    // Populate Table
    loadBuildings();

    // Edit Button Listener
    const onEditButton = (building) => {
      editMode.value = true;
      addMode.value = false;
      showBuildingForm.value = true;
      currentBuilding.value = building;
    }

    // Add Button Listener
    const onAddButton = () => {
      if (addMode.value) {
        addMode.value = false;
      } else {
        addMode.value = true;
        showBuildingForm.value = true;
        currentBuilding.value = {
          name: '',
          floors: 1,
          latitude: 39.48067057885303,
          longitude: -0.3398773008264785
        };
      }
    }

    // Delete Button Listener
    const onDeleteButton = (building) => {
      if (confirm(`Are you sure you want to delete ${building.name}?\nWARNING: This will remove all coordinates related to this building.`)) {
        try {
          axios.delete(`http://localhost:3000/buildings/${building.id}`).then(() => {
            buildings.value.splice(currentIndex.value, 1);
          });
        } catch(err) {
          alert(err.message);
        }
      }
    }

    // Hide Editing Building Window
    const hideBuildingForm = () => {
      addMode.value = false;
      editMode.value = false;
      showBuildingForm.value = false;
    }

    // Method executed when a building has been created or edited
    const updateBuildings = (building) => {
      if (editMode.value) {
        buildings.value[currentIndex.value] = building;
      }
      if (addMode.value) {
        loadBuildings();
      }
      hideBuildingForm();
    }

    return {
      buildings,
      addMode,
      editMode,
      showBuildingForm,
      currentBuilding,
      currentIndex,
      onDeleteButton,
      onEditButton,
      onAddButton,
      hideBuildingForm,
      updateBuildings
    };
  },
};
</script>