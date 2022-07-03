<template>
  <div class="flex flex-col gap-8 pt-8">
    <div class="h-12 flex justify-center">
      <!-- Add Building Button -->
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
    <div class="px-10">
      <table class="divide-y divide-gray-300 w-full text-center table-auto border-b border-gray-200 shadow">
        <thead class="bg-gray-50">
          <!-- Header Titles -->
          <tr class="text-xs text-gray-500">
            <th class="px-6 py-2">ID</th>
            <th class="px-6 py-2">Name</th>
            <th class="px-6 py-2">Latitude</th>
            <th class="px-6 py-2">Longitude</th>
            <th class="px-6 py-2 w-32"></th>
            <th class="px-6 py-2 w-32"></th>
          </tr>
        </thead>
        <!-- Table Rows -->
        <tbody class="bg-white divide-y divide-gray-300">
          <!-- Row to add new buildings -->
          <tr class="whitespace-nowrap text-sm text-gray-900 h-1" v-if="addMode">
            <td class="px-6 py-4"></td>
            <td class="px-6 py-4">
              <input
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
            </td>
            <td class="px-6 py-4">
              <input
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
            </td>
            <td class="px-6 py-4">
              <input
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
            </td>
            <td class="px-6 py-4">
              <button class="bg-green-400 hover:bg-green-500 text-white py-2 px-3 rounded w-20"
                @click="onSaveButton()">
                Save
              </button>
            </td>
            <td class="px-6 py-4">
              <button 
                class="bg-slate-200 hover:bg-slate-300 text-black py-2 px-3 rounded w-20"
                @click="onCancelButton()">
                Cancel
              </button>
            </td>
          </tr>
          <!-- For loop to create building rows from an array -->
          <tr
            v-for="(building, index) in buildings"
            v-bind:key="building.id"
            class="whitespace-nowrap text-sm text-gray-900 h-1 min-h-0"
          >
            <!-- ID Field -->
            <td class="px-6 py-4">{{ building.id }}</td>
            <!-- Name Field -->
            <td class="px-6 py-4">
              <input
                v-if="editMode && currentIndex == index"
                v-model="building.name"
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
              <span v-else>
                {{ building.name }}
              </span>
            </td>
            <!-- Latitude Field -->
            <td class="px-6 py-4">
              <input
                v-if="editMode && currentIndex == index"
                v-model="building.latitude"
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
              <span v-else>
                {{ building.latitude }}
              </span>
            </td>
            <!-- Longitude Field -->
            <td class="px-6 py-4">
              <input
                v-if="editMode && currentIndex == index"
                v-model="building.longitude"
                type="text"
                class="px-2 py-1 outline outline-1 outline-slate-300 rounded-md"
              />
              <span v-else>
                {{ building.longitude }}
              </span>
            </td>
            <!-- Save Button -->
            <td class="px-6 py-4" v-if="editMode && currentIndex == index">
              <button
                class="bg-green-400 hover:bg-green-500 text-white py-2 px-3 rounded w-20"
                @click="onSaveButton(building)">
                Save
              </button>
            </td>
            <!-- Edit Button -->
            <td class="px-6 py-4" v-if="!editMode">
              <button 
                class="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded w-20"
                @click="onEditButton(index)" >
                Edit
              </button>
            </td>
          <!-- Delete Button -->
            <td class="px-6 py-4" v-if="!editMode">
              <button 
                class="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded w-20"
                @click="onDeleteButton(building)">
                Delete
              </button>
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
    const addMode = ref(false);
    const editMode = ref(false);
    const currentIndex = ref(null);

    const buildings = ref(null);

    const loadBuildings = () => {
      axios.get("http://localhost:3000/building").then((response) => {
        buildings.value = response.data;
      });
    };

    const onEditButton = (index) => {
      editMode.value = true;
      currentIndex.value = index;
      addMode.value = false;
    }

    const onAddButton = () => {
      if (addMode.value) {
        addMode.value = false;
      } else {
        addMode.value = true;
      }
    }

    const onSaveButton = async (building) => {
      if (addMode.value) { // Add mode
        addMode.value = false;
      } else { // Edit mode
        const response = await axios({
          method: 'put',
          url: `http://localhost:3000/building/${building.id}`,
          data: {
            name: building.name,
            latitude: building.latitude,
            longitude: building.longitude
          }
        });
        editMode.value = false;
        confirm(response.data);
      }
    }

    const onCancelButton = () => {
      addMode.value = false;
    }

    const onDeleteButton = (building) => {
      if (confirm("Are you sure you want to delete building " + building.name)) {
        console.log("You pressed YES");
      } else {
        console.log("You pressed CANCEL");
      }
    }

    // Execute methods
    loadBuildings();

    return {
      buildings,
      addMode,
      editMode,
      currentIndex,
      onDeleteButton,
      onEditButton,
      onAddButton,
      onCancelButton,
      onSaveButton
    };
  },
};
</script>