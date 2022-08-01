<template>
    <div class="fixed overflow-x-hidden overflow-y-auto inset-0 flex justify-center items-center z-30">
        <div class="relative mx-auto w-1/2 max-w-2xl">
            <div class="bg-white rounded shadow-2xl flex flex-col px-10 py-10">
                <!-- Name Field -->
                    <div class="mb-6">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="UPV Test Building">
                    </div>
                    <!-- Floors Field -->
                    <div class="mb-6">
                        <label for="floors" class="block mb-2 text-sm font-medium text-gray-900">Floors</label>
                        <select id="floors" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                            <option v-for="index in 8" :key="index">{{ index }}</option>
                        </select>
                    </div>
                    <!-- Latitude Field -->
                    <div class="mb-6">
                        <label for="latitude" class="block mb-2 text-sm font-medium text-gray-900">Latitude</label>
                        <input id="latitude" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                    </div>
                    <!-- Longitude Field -->
                    <div class="mb-6">
                        <label for="longitude" class="block mb-2 text-sm font-medium text-gray-900">Longitude</label>
                        <input id="longitude" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                    </div>
                    <div class="flex space-x-5 mt-6">
                        <button @click="onCancelButton" class="basis-1/2 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Save</button>
                        <button @click="onCancelButton" class="basis-1/2 text-black bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Cancel</button>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'BuildingForm',
    setup(props, { emit }) {

        const onCancelButton = () => {
            emit("onCloseButton", false);
        }

        return {
            onCancelButton
        }
    }
}
</script>