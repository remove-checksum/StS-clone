<script setup lang="ts">
import { ref } from 'vue';

const cardSlot = ref<HTMLElement | null>(null)

defineExpose({
  cardSlot
})

</script>

<template>
  <div
    ref="cardSlot"
    class="min-w-0"
  >
    <slot></slot>
  </div>
</template>