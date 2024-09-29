<script setup lang="ts">
import { ref } from 'vue';
const element = ref<HTMLDivElement | null>(null)
defineExpose({
  element
})

</script>
<template>
  <div ref="element" class="aspect-[0.72/1] xl:w-36 border-2 border-gray-800 xl:p-2">
    <h3 class="text-2xl">
      <slot name="header"></slot>
    </h3>
    <slot name="content"></slot>
  </div>
</template>