<template>
    <div class="flex flex-row h-10 w-full rounded-lg relative bg-gray-50 mt-1 border border-gray-300">
        <button @click="decreaseFloorNumber" id="decreaseButton" class=" bg-transparent text-gray-900 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
            <i class="fa-solid fa-minus"></i>
        </button>
        <label class="focus:outline-none text-center w-full bg-transparent justify-center font-semibold text-md md:text-basecursor-default flex items-center text-gray-900 outline-none">{{ floor }}</label>
        <button @click="increaseFloorNumber" id="increaseButton" class="bg-transparent text-gray-900 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
            <i class="fa-solid fa-plus"></i>
        </button>
    </div>
</template>

<script>

import { ref } from "vue";

export default {
    name: 'FloorCounter',
    props: ['floors', 'fromBuildingTable'],
    setup(props, { emit }) {

        const floor = ref(JSON.parse(JSON.stringify(props.floors)));
        let maxFloors;

        if (props.fromBuildingTable) {
            maxFloors = 163;
        } else {
            maxFloors = floor.value;
            floor.value = 1;
        }

        const decreaseFloorNumber = () => {
            if (floor.value > 1) {
                floor.value--;
                emit('onFloorUpdated', floor.value);
            }
        }

        const increaseFloorNumber = () => {
            console.log(maxFloors);
            if (floor.value < maxFloors) {
                floor.value++;
                emit('onFloorUpdated', floor.value);
            }
        }

        return {
            floor,
            decreaseFloorNumber,
            increaseFloorNumber
        }

    }
};
</script>