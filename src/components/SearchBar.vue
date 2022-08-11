<template>
    <div class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]
    flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent">
        <!-- Building Selector -->
        <div class="relative flex-1 md:min-w-[350px]">
            <!-- Selected Building -->
            <select class="pl-9 pr-4 py-[7px] text-base focus:outline-none hover:outline outline-1 outline-slate-400 hover:cursor-pointer w-full shadow-md rounded-md" 
                    v-model="selectedBuilding" @change="onBuildingSelected()">
                <option v-for="building in buildings" v-bind:key="building.name" :value="building">
                    {{ building.name }}
                </option>
            </select>
            <!-- Builiding Icon -->
            <div class="absolute top-0 left-[14px] h-full flex items-center hover:cursor-pointer" @click="onBuildingSelected()">
                <i v-if="selectedBuilding" class="fa-solid fa-location-crosshairs text-slate-600 text-xl"></i>
            </div>
        </div>
        <!-- Date Picker -->
        <div class="relative flex-1 shadow-md rounded-md md:min-w-[300px]">
            <Datepicker
                class="h-full"
                ref="datepicker"
                range multiCalendars
                :presetRanges="presetRanges"
                v-model="dates"
                :format="dateFormat"
                :clearable="false"
                :maxDate="new Date()"
                :closeOnAutoApply="false"
                autoApply
            ></Datepicker>
        </div>
        <!-- Search Button -->
        <button
            class="px-4 shadow-md rounded-md bg-slate-600 hover:bg-slate-700 disabled:bg-slate-500 disabled:hover:bg-slate-500"
            @click="getHeatmap"
            :disabled="!selectedBuilding || !dates">
            <i class="fa-solid fa-magnifying-glass text-[15px] text-white"></i></button>
    </div>
</template>

<script>

import Datepicker from "@vuepic/vue-datepicker";
import axios from "axios";
import { ref, onMounted } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import moment from 'moment';
import {startOfMonth, subMonths, subYears } from 'date-fns';

export default {
    components: { Datepicker },

    setup(props, { emit }) {
        // Building Selector variables
        const selectedBuilding = ref(null);
        const buildings = ref(null);

        // API Call to retrieve list of buildings
        const loadBuildings = () => {
            axios.get("http://localhost:3000/buildings").then((response) => {
                buildings.value = response.data;
            })
        }

        // Start/End Date variables
        const dates = ref();
        const presetRanges = ref([
          { label: 'Today', range: [new Date().setHours(0,0,0,0), new Date().setHours(23,59,0,0)] },
          { label: 'This month', range: [startOfMonth(new Date().setHours(0,0,0,0)), new Date().setHours(23,59,0,0)] },
          {
            label: 'Last month',
            range: [subMonths(new Date().setHours(0,0,0,0), 1), new Date().setHours(23,59,0,0)],
          },
          { label: 'This year', range: [subYears(new Date().setHours(0,0,0,0), 1), new Date().setHours(23,59,0,0)] },
        ]);

        onMounted(() => {
            const startDate = new Date();
            const endDate = new Date();

            startDate.setDate(endDate.getDate());
            startDate.setHours(0,0,0,0);
            endDate.setHours(23,59,0,0);

            dates.value = [startDate, endDate];
        })

        // Date format
        const dateFormat = (dates) => {
            const startDate = dates[0];
            const endDate = dates[1];

            return `${getDateString(startDate)} - ${getDateString(endDate)}`;
        }

        function getDateString(date) {
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let minutesFormatted = Math.floor(minutes / 10) + '' + minutes % 10;

            return `${day}/${month + 1}/${year} ${hours}:${minutesFormatted}`;
        }

        // Search Button listener
        const getHeatmap = async () => {
            try {
                const data = await axios.get(`http://localhost:3000/coordinates`, {
                    params: {
                        building: selectedBuilding.value.id,
                        startDate: getStartDate(),
                        endDate: getEndDate()
                    }
                });
                const result = data.data;
                if (result.length === 0) {
                    alert("No coordinates were found for this search criteria");
                }
                emit("loadHeatmap", result);
            }
            catch(err) {
                alert(err.message);
            }
        }

        const getStartDate = () => {
            return moment(dates.value[0]).utcOffset(0, true).format();
        }

        const getEndDate = () => {
            return moment(dates.value[1]).utcOffset(0, true).format();
        }

        const onBuildingSelected = () => {
            if (selectedBuilding.value) {
                emit("moveToBuilding", selectedBuilding.value);
            }
        }

        // Execute API Calls
        loadBuildings();

        return {
            selectedBuilding,
            buildings,
            onBuildingSelected,
            loadBuildings,
            dates,
            presetRanges,
            dateFormat,
            getHeatmap
        }
    }
}
</script>

<style lang="scss">
$dp__border_radius: 5px !default; // Border radius everywhere
$dp__menu_min_width: 290px !default; // Adjust the min width of the menu
$dp__cell_size: 40px !default; // width and height of calendar cell
$dp__preview_font_size: 1rem !default; // font size of the date preview in the action row
@import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #475569;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #475569;
  --dp-hover-icon-color: #475569;
  --dp-primary-color: #475569;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #475569;
  --dp-danger-color: #ff6f60;
}

</style>