<template>
  <div class="flex flex-col h-screen">
    <nav class="bg-slate-900 flex gap-4 py-2 px-3">
    <router-link to="/" class="text-white font-bold text-lg">Heatmap</router-link>
    <router-link to="/building" class="text-white font-bold text-lg">Buildings</router-link>
  </nav>
  <router-view class="grow"/>
  </div>
</template>
