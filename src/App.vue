<template>
  <nav class="h-full bg-gray-800 flex gap-4 py-2 px-3">
    <router-link to="/" class="text-white font-bold text-lg">Heatmap</router-link>
    <router-link to="/building" class="text-white font-bold text-lg">Buildings</router-link>
    <router-link to="/ofertas" class="text-white font-bold text-lg">Ofertas</router-link>
  </nav>
  <router-view/>
</template>
