<template>
  <div class="flex flex-col relative">
    <!-- Top Section -->
    <div class="flex justify-center px-5 py-6 bg-transparent">
      <button
        class="
          w-full max-w-sm
          px-4
          py-2
          font-bold
          text-3xl
          bg-green-500
          text-white
          rounded-full
          shadow-sm
          hover:bg-green-600
        "
        @click="onAddButton"
      >
        +
      </button>
    </div>
    <!-- Bottom Section -->
    <div class="flex justify-center px-5 bg-transparent rounded-lg">
      <table class="table-fixed w-full border-b border-gray-200 shadow">
        <thead class="bg-gray-50">
          <!-- Header Titles -->
          <tr class="text-gray-500">
            <th class="text-center lg:w-1/2">Name</th>
            <th class="text-center">Floors</th>
            <th class="text-center lg:w-1/12"></th>
            <th class="text-center lg:w-1/12"></th>
          </tr>
        </thead>
        <!-- Table Rows -->
        <tbody class="bg-white divide-y divide-gray-300">
          <!-- For loop to create building rows from an array -->
          <tr
            v-for="(building, index) in buildings"
            v-bind:key="building.id"
          >
            <!-- Name Field -->
            <td class="text-center">{{ building.name }}</td>
            <!-- Floors Fields -->
            <td class="text-center">{{ building.floors }}</td>
            <!-- Edit Button -->
            <td class="text-center">
              <div 
                class="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md"
                @click="currentIndex = index; onEditButton(building)">
                <i class="fa-solid fa-pen"></i>
              </div>
            </td>
          <!-- Delete Button -->
            <td class="text-center">
              <div 
                class="bg-red-400 hover:bg-red-500 text-white p-2 rounded-md"
                @click="currentIndex = index; onDeleteButton(building)">
                <i class="fa-solid fa-trash-can"></i>
              </div>
            </td>    
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Building Editing Modal Window -->
    <div v-if="showBuildingForm"
    class="absolute w-full h-full md:px-5 md:py-5 z-20">
      <BuildingForm
        :editMode="editMode"
        :building="currentBuilding"
        @onSaveButton="updateBuildings"
        @onCloseButton="hideBuildingForm"/>
    </div>
    <div v-if="showBuildingForm" class="absolute inset-0 z-10 opacity-25 bg-black"></div>
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
        axios.get("http://192.168.18.118:3000/buildings").then((response) => {
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
          axios.delete(`http://192.168.18.118:3000/buildings/${building.id}`).then(() => {
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