<script setup lang="ts">
import {computed} from "vue";
import {useProfile} from "../composables/useProfile.ts";

const { backgroundBase64 } = useProfile();

const bgStyle = computed(() => {
  if (backgroundBase64.value) {
    return {
      backgroundImage: `url(${backgroundBase64.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  
  return {
    background: 'linear-gradient(to bottom right, #60a5fa, #c084fc, #f472b6)'
  };
});

</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden text-slate-800">

    <div
        class="absolute inset-0 z-0 transition-all duration-500 ease-in-out"
        :style="bgStyle"
    ></div>
    
    <div class="absolute inset-0 z-0 bg-white/30 backdrop-blur-[2px]"></div>
    
    <div class="relative z-10 flex h-screen w-full">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>